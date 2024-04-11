use ark_serialize::{CanonicalDeserialize, CanonicalSerialize};
use jolt::Proof;
use std::{
    self,
    ffi::{c_char, CStr, CString},
};

#[derive(CanonicalSerialize, CanonicalDeserialize)]
struct JoltResult {
    proof: Proof,
    output: u64,
}

pub fn generate_proof(n: u32) -> Vec<u8> {
    let (program, preprocessed) = guest::preprocess_fib();
    let (output, proof) = guest::prove_fib(program, preprocessed, n);
    let jolt_result = JoltResult { proof, output };
    let mut result_bytes = Vec::new();
    jolt_result.serialize_compressed(&mut result_bytes).unwrap();
    result_bytes
}

#[no_mangle]
pub extern "C" fn jolt_prove(n: u32) -> *const c_char {
    let result_bytes = generate_proof(n);
    let json_string = serde_json::to_string(&result_bytes).unwrap();
    let c_string = CString::new(json_string).unwrap();
    c_string.into_raw()
}

#[no_mangle]
pub extern "C" fn jolt_verify(proof: *const c_char) -> bool {
    let c_str = unsafe { CStr::from_ptr(proof) }.to_str().unwrap();
    let jolt_result_bytes: Vec<u8> = serde_json::from_str(c_str).unwrap();
    let result = JoltResult::deserialize_compressed(&*jolt_result_bytes).unwrap();

    let (_, verify_fib) = guest::build_fib();

    verify_fib(result.proof)
}
