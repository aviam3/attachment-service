
# Attachment-Service


The service functions as the backend for a messaging application.\
User can upload file, and in return, receive a thumbnail image representing the uploaded file.\
At this time, only images are supported.


## Tools & Technologies
* Express TypeScript
* AWS SDK V3
* Packages: [multer](https://www.npmjs.com/package/multer), [sharp](https://www.npmjs.com/package/sharp)\
\
This project follows the ***Strategy design pattern***, allowing for easy integration of additional storage providers beyond AWS, such as Google Cloud Storage, Azure Blob Storage, etc.
This flexibility **enables seamless scalability and adaptability** to different storage requirements.
## Running the project
```batch
$ docker compose up
```
or
```batch
$ git clone https://github.com/aviam3/attachment-service/
$ npm install
$ cd attachment-service
$ npm run start
```
## Local Development Setup
To run the project locally, you need to set up your environment variables.\
Create a `.env` file in the root directory of your project and add the following variables:
```plaintext
# AWS Credentials
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=your_aws_region
```
## API Reference

#### Uploads an image.

```http
  POST /attachment/upload
```
#### Request Headers:
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `user_id` | `string` | ID of the user |
|`vendor_id`|`string`| ID of the vendor (by default: AWS)|

#### Request Body:
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `file` | `File` | Image file to upload (supported types: jpeg, jpg, png, gif) |
|`message_id`|`string`| ID of the message associated with the image|

```bash
curl -X POST \
  -H "Content-Type: multipart/form-data" \
  -H "user_id: [replace_with_actual_user_id]" \
  -H "vendor_id: [replace_with_actual_vendor_id]" \
  -F "file=@[replace_with_actual_path_to_file]" \
  -F "message_id=[replace_with_actual_id]" \
  http://localhost:3000/attachment/upload
```
  **Response:**

- **200 OK** - If the image is uploaded successfully.

Response Body (JSON):

```json
{
  "attachment_id": "123456789", 
  "thumbnail_download_url": "https://example.com/thumbnail.jpg"
}
```
