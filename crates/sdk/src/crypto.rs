use ring::aead::{
    Aad, BoundKey, Nonce, NonceSequence, OpeningKey, SealingKey, UnboundKey, AES_256_GCM,
};
use ring::error::Unspecified;
use ring::rand::{SecureRandom, SystemRandom};

pub const IV_LENGTH: usize = 12;
pub const TAG_LENGTH: usize = 16;

struct SingleNonceSequence(Option<[u8; IV_LENGTH]>);

impl NonceSequence for SingleNonceSequence {
    fn advance(&mut self) -> Result<Nonce, Unspecified> {
        self.0
            .take()
            .map(Nonce::assume_unique_for_key)
            .ok_or(Unspecified)
    }
}

pub fn encrypt_aes_gcm(plaintext: &[u8], key: &[u8]) -> Result<Vec<u8>, Unspecified> {
    if key.len() != 32 {
        return Err(Unspecified);
    }
    let rng = SystemRandom::new();
    let mut iv = [0u8; IV_LENGTH];
    rng.fill(&mut iv)?;

    let unbound_key = UnboundKey::new(&AES_256_GCM, key)?;
    let nonce_seq = SingleNonceSequence(Some(iv));
    let mut sealing_key = SealingKey::new(unbound_key, nonce_seq);

    let mut in_out = plaintext.to_vec();
    sealing_key.seal_in_place_append_tag(Aad::empty(), &mut in_out)?;

    let mut result = Vec::with_capacity(IV_LENGTH + in_out.len());
    result.extend_from_slice(&iv);
    result.extend_from_slice(&in_out);
    Ok(result)
}

pub fn decrypt_aes_gcm(encrypted: &[u8], key: &[u8]) -> Result<Vec<u8>, Unspecified> {
    if key.len() != 32 || encrypted.len() < IV_LENGTH + TAG_LENGTH {
        return Err(Unspecified);
    }
    let (iv_bytes, ciphertext) = encrypted.split_at(IV_LENGTH);
    let mut iv = [0u8; IV_LENGTH];
    iv.copy_from_slice(iv_bytes);

    let unbound_key = UnboundKey::new(&AES_256_GCM, key)?;
    let nonce_seq = SingleNonceSequence(Some(iv));
    let mut opening_key = OpeningKey::new(unbound_key, nonce_seq);

    let mut in_out = ciphertext.to_vec();
    let plaintext = opening_key.open_in_place(Aad::empty(), &mut in_out)?;
    Ok(plaintext.to_vec())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_aes_gcm_roundtrip() {
        let key = [7u8; 32];
        let message = b"Hello Falcon Remote Desktop";
        let encrypted = encrypt_aes_gcm(message, &key).unwrap();
        let decrypted = decrypt_aes_gcm(&encrypted, &key).unwrap();
        assert_eq!(message.to_vec(), decrypted);
    }
}
