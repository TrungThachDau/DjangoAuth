import hashlib

def calculate_sha256(file_content):
    try:

        sha256_hash = hashlib.sha256(file_content).hexdigest()
        return sha256_hash
    except Exception as e:
         print(f"An error occurred: {e}")
         return None
    
def verify_sha256(file_content, expected_hash):
    try:
        sha256_hash = calculate_sha256(file_content)
        if sha256_hash == expected_hash:
            return True
        else:
            return False
    except Exception as e:
         print(f"An error occurred: {e}")
         return False