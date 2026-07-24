use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::Mutex;
use tokio::task::JoinHandle;
use tokio::time::{self, Duration};

pub type ScheduledTaskFn = Box<dyn Fn() -> tokio::task::JoinHandle<()> + Send + Sync>;

pub struct TaskScheduler {
    tasks: Arc<Mutex<HashMap<String, JoinHandle<()>>>>,
}

impl TaskScheduler {
    pub fn new() -> Self {
        Self {
            tasks: Arc::new(Mutex::new(HashMap::new())),
        }
    }

    pub async fn schedule_recurring<F, Fut>(&self, name: &'static str, interval_duration: Duration, task_fn: F)
    where
        F: Fn() -> Fut + Send + Sync + 'static,
        Fut: std::future::Future<Output = ()> + Send + 'static,
    {
        let mut map = self.tasks.lock().await;
        if let Some(old_handle) = map.remove(name) {
            old_handle.abort();
        }

        let handle = tokio::spawn(async move {
            let mut ticker = time::interval(interval_duration);
            loop {
                ticker.tick().await;
                task_fn().await;
            }
        });

        map.insert(name.to_string(), handle);
    }

    pub async fn cancel_task(&self, name: &str) -> bool {
        let mut map = self.tasks.lock().await;
        if let Some(handle) = map.remove(name) {
            handle.abort();
            true
        } else {
            false
        }
    }

    pub async fn active_task_count(&self) -> usize {
        let map = self.tasks.lock().await;
        map.len()
    }

    pub async fn shutdown_all(&self) {
        let mut map = self.tasks.lock().await;
        for (_, handle) in map.drain() {
            handle.abort();
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::sync::atomic::{AtomicUsize, Ordering};

    #[tokio::test]
    async fn test_task_scheduler_recurring() {
        let scheduler = TaskScheduler::new();
        let counter = Arc::new(AtomicUsize::new(0));

        let counter_clone = counter.clone();
        scheduler
            .schedule_recurring("heartbeat", Duration::from_millis(50), move || {
                let c = counter_clone.clone();
                async move {
                    c.fetch_add(1, Ordering::SeqCst);
                }
            })
            .await;

        tokio::time::sleep(Duration::from_millis(180)).await;
        assert!(counter.load(Ordering::SeqCst) >= 2);
        assert_eq!(scheduler.active_task_count().await, 1);

        scheduler.cancel_task("heartbeat").await;
        assert_eq!(scheduler.active_task_count().await, 0);
    }
}
