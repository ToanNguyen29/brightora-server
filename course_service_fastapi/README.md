# Note

## .env

CLIENT_URL=...\
MONGO_DATABASE_URL=...\
GOOGLE_DRIVE_OAUTH_URL=...\
GOOGLE_DRIVE_CLIENT_ID=...\
GOOGLE_DRIVE_CLIENT_SECRET=...\
GOOGLE_DRIVE_REFRESH_TOKEN=...

## Run source

`py -m venv venv`\
`pip install -r requirements.txt`\
`uvicorn app.app:app --reload`

## Add path URL for Google Drive services

**POST**:{{host}}/api/v1/directory/

- **Path**: `/CapstoneProject`  
  **Google ID**: [1pdDBDK0VwkJn9GkF0akd3jXWgm7EL4xB](https://drive.google.com/drive/folders/1pdDBDK0VwkJn9GkF0akd3jXWgm7EL4xB)

---

- **Path**: `/CapstoneProject/video`  
  **Google ID**: [1f2UKA5aP6JimNpWYdXOk1oLt0QMNsm6U](https://drive.google.com/drive/folders/1f2UKA5aP6JimNpWYdXOk1oLt0QMNsm6U)

---

- **Path**: `/CapstoneProject/image`  
  **Google ID**: [12LIwvIE_xGT_lsgfGPnv2ouJsRu9jDyO](https://drive.google.com/drive/folders/12LIwvIE_xGT_lsgfGPnv2ouJsRu9jDyO)

---

- **Path**: `/CapstoneProject/document`  
  **Google ID**: [1TEDS41usfXwJ-kXOGyKpMvuJ-QjtoPiH](https://drive.google.com/drive/folders/1TEDS41usfXwJ-kXOGyKpMvuJ-QjtoPiH)
