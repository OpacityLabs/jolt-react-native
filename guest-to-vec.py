import sys
import os
import numpy as np
import json

# "/private/tmp/jolt-guest-target-fibonacci-guest-fib/riscv32i-unknown-none-elf/release/guest"

# Check if the correct number of command line arguments is provided
if len(sys.argv) != 2:
    print("Usage: python guest-to-vec.py <file>")
    sys.exit(1)

# Get the file path from the command line argument
file_path = sys.argv[1]

# Check if the file exists
if not os.path.isfile(file_path):
    print(f"Error: File '{file_path}' does not exist.")
    sys.exit(1)

with open(file_path,"rb") as f:
    raw_file_data = f.read()
    uint8_array = np.frombuffer(raw_file_data, dtype=np.uint8).tolist()
    
file_str = f'''
const ELF_BINARY: [u8; {len(uint8_array)}] = {json.dumps(uint8_array)};
'''

    
    
with open("native_rust_lib/src/executable.rs","w") as f:
    f.write(file_str)