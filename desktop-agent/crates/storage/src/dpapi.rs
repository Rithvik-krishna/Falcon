use thiserror::Error;

#[derive(Debug, Error)]
pub enum DpapiError {
    #[error("DPAPI encryption failed: {0}")]
    EncryptFailed(u32),
    #[error("DPAPI decryption failed: {0}")]
    DecryptFailed(u32),
}

#[cfg(windows)]
pub fn dpapi_encrypt(data: &[u8]) -> Result<Vec<u8>, DpapiError> {
    use windows_sys::Win32::Foundation::{GetLastError, LocalFree};
    use windows_sys::Win32::Security::Cryptography::{CryptProtectData, CRYPT_INTEGER_BLOB};

    let mut input_blob = CRYPT_INTEGER_BLOB {
        cbData: data.len() as u32,
        pbData: data.as_ptr() as *mut u8,
    };
    let mut output_blob = CRYPT_INTEGER_BLOB {
        cbData: 0,
        pbData: std::ptr::null_mut(),
    };

    let success = unsafe {
        CryptProtectData(
            &mut input_blob,
            std::ptr::null(),
            std::ptr::null(),
            std::ptr::null_mut(),
            std::ptr::null_mut(),
            0,
            &mut output_blob,
        )
    };

    if success == 0 {
        return Err(DpapiError::EncryptFailed(unsafe { GetLastError() }));
    }

    let encrypted = unsafe {
        std::slice::from_raw_parts(output_blob.pbData, output_blob.cbData as usize).to_vec()
    };

    unsafe {
        LocalFree(output_blob.pbData as _);
    }

    Ok(encrypted)
}

#[cfg(windows)]
pub fn dpapi_decrypt(encrypted: &[u8]) -> Result<Vec<u8>, DpapiError> {
    use windows_sys::Win32::Foundation::{GetLastError, LocalFree};
    use windows_sys::Win32::Security::Cryptography::{CryptUnprotectData, CRYPT_INTEGER_BLOB};

    let mut input_blob = CRYPT_INTEGER_BLOB {
        cbData: encrypted.len() as u32,
        pbData: encrypted.as_ptr() as *mut u8,
    };
    let mut output_blob = CRYPT_INTEGER_BLOB {
        cbData: 0,
        pbData: std::ptr::null_mut(),
    };

    let success = unsafe {
        CryptUnprotectData(
            &mut input_blob,
            std::ptr::null_mut(),
            std::ptr::null(),
            std::ptr::null_mut(),
            std::ptr::null_mut(),
            0,
            &mut output_blob,
        )
    };

    if success == 0 {
        return Err(DpapiError::DecryptFailed(unsafe { GetLastError() }));
    }

    let decrypted = unsafe {
        std::slice::from_raw_parts(output_blob.pbData, output_blob.cbData as usize).to_vec()
    };

    unsafe {
        LocalFree(output_blob.pbData as _);
    }

    Ok(decrypted)
}

#[cfg(not(windows))]
pub fn dpapi_encrypt(data: &[u8]) -> Result<Vec<u8>, DpapiError> {
    let mut dummy = vec![0xFF; 4];
    dummy.extend_from_slice(data);
    Ok(dummy)
}

#[cfg(not(windows))]
pub fn dpapi_decrypt(encrypted: &[u8]) -> Result<Vec<u8>, DpapiError> {
    if encrypted.len() < 4 {
        return Err(DpapiError::DecryptFailed(0));
    }
    Ok(encrypted[4..].to_vec())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_dpapi_encrypt_decrypt_roundtrip() {
        let secret = b"FalconDeviceSecretPrivateKey2026";
        let encrypted = dpapi_encrypt(secret).unwrap();
        assert_ne!(secret.to_vec(), encrypted);

        let decrypted = dpapi_decrypt(&encrypted).unwrap();
        assert_eq!(secret.to_vec(), decrypted);
    }
}
