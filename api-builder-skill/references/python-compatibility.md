# Python Compatibility Notes

## bcrypt / passlib — Python 3.12+

**Problem:** `passlib[bcrypt]` is broken on Python 3.12 and above. It raises:
```
ValueError: password cannot be longer than 72 bytes
```
This is an internal bug in passlib's bcrypt wrapper — not the user's code.

**Fix:** Use `bcrypt` directly instead of passlib for all Python projects.

### requirements.txt
```
bcrypt==4.1.3
python-jose[cryptography]==3.3.0
```
Remove `passlib` entirely.

### app/core/security.py — correct pattern
```python
from datetime import datetime, timedelta
from jose import JWTError, jwt
import bcrypt
from app.config import settings

def hash_password(password: str) -> str:
    password_bytes = password[:72].encode("utf-8")
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password_bytes, salt).decode("utf-8")

def verify_password(plain: str, hashed: str) -> bool:
    plain_bytes = plain[:72].encode("utf-8")
    hashed_bytes = hashed.encode("utf-8")
    return bcrypt.checkpw(plain_bytes, hashed_bytes)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def decode_token(token: str) -> dict:
    return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
```

**Never generate** `from passlib.context import CryptContext` for Python 3.12+ projects.
Always use `import bcrypt` directly.

## email-validator — not auto-installed

Pydantic's `EmailStr` type requires a separate package that is NOT installed automatically:

```
pip install email-validator
```

Always include `email-validator` in `requirements.txt` when using `EmailStr` in schemas.
