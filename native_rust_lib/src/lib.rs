use ark_serialize::{CanonicalDeserialize, CanonicalSerialize};
use executable::ELF_BINARY;
use jolt::{host::Program, Jolt, Proof, RV32IJoltVM};

use std::{
    self,
    ffi::{c_char, CStr, CString},
};
mod executable;

#[derive(CanonicalSerialize, CanonicalDeserialize)]
struct JoltResult {
    input: u32,
    proof: Proof,
    output: u64,
}

fn generate_proof(n: u32) -> Vec<u8> {
    let mut program: Program = Program::new("fibonacci-binary-guest");
    program.set_input(&n);
    let (bytecode, memory_init) = program.decode_binary(Vec::from(ELF_BINARY));
    let preprocessed = RV32IJoltVM::preprocess(bytecode, memory_init, 1 << 20, 1 << 20, 1 << 20);
    let (output, proof) = guest::prove_fib(program.clone(), preprocessed, n);
    let jolt_result = JoltResult {
        proof,
        output,
        input: n,
    };
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

fn verify_proof(proof: JoltResult) -> bool {
    let mut program: Program = Program::new("fibonacci-binary-guest");
    program.set_input(&proof.input);
    let (bytecode, memory_init) = program.decode_binary(Vec::from(ELF_BINARY));
    let preprocessed = RV32IJoltVM::preprocess(bytecode, memory_init, 1 << 20, 1 << 20, 1 << 20);
    RV32IJoltVM::verify(preprocessed, proof.proof.proof, proof.proof.commitments).is_ok()
}

#[no_mangle]
pub extern "C" fn jolt_verify(proof: *const c_char) -> bool {
    let c_str = unsafe { CStr::from_ptr(proof) }.to_str().unwrap();
    let jolt_result_bytes: Vec<u8> = serde_json::from_str(c_str).unwrap();
    let result = JoltResult::deserialize_compressed(&*jolt_result_bytes).unwrap();
    verify_proof(result)
}
