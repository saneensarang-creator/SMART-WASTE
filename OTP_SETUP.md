# SMART WASTE OTP Service Setup

## Prerequisites
- Node.js installed
- Twilio account (free trial: https://www.twilio.com/try-twilio)

## Installation

1. **Install dependencies:**
```bash
npm install express twilio dotenv cors body-parser
```

2. **Create `.env` file in the waste folder:**
```
TWILIO_ACCOUNT_SID=your_account_sid_from_twilio
TWILIO_AUTH_TOKEN=your_auth_token_from_twilio
TWILIO_PHONE_NUMBER=+1234567890
PORT=5000
```

3. **Get Twilio Credentials:**
   - Sign up at https://www.twilio.com
   - Go to Dashboard → Account Info
   - Copy Account SID and Auth Token
   - Get a trial phone number from Phone Numbers section

4. **Run the server:**
```bash
node server.js
```

Server will run on `http://localhost:5000`

## API Endpoints

### Send OTP
- **POST** `/api/send-otp`
- Body: `{ "phoneNumber": "+15551234567" }`
- Response: `{ "success": true, "phone": "****4567" }`

### Verify OTP
- **POST** `/api/verify-otp`
- Body: `{ "phoneNumber": "+15551234567", "otp": "123456" }`
- Response: `{ "success": true, "token": "..." }`

### Register User
- **POST** `/api/register-user`
- Body: `{ "phoneNumber": "...", "name": "...", "dob": "...", "email": "..." }`
- Response: User registration confirmation

## Frontend Integration

The login modal automatically sends requests to these endpoints when:
1. User clicks "Send OTP" → calls `/api/send-otp`
2. User verifies OTP → calls `/api/verify-otp`
3. User completes profile → calls `/api/register-user`

## Testing

For testing without real SMS:
- Use Twilio trial numbers in format: `+1555555XXXX`
- Check server console for generated OTP
- Enter that OTP in the modal
