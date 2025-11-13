# User Verification Flow - Implementation Plan

## 📋 Overview

Currently, any user can register and immediately access the application. We need to implement an admin verification system where:

1. **New users register** → Account created with **"Pending"** status
2. **Admin reviews** → Admin can see pending users in User Management section
3. **Admin approves/rejects** → Admin can verify or reject user accounts
4. **Verified users** → Only verified users can access the application

---

## 🔄 User Registration Flow Changes

### Current Flow
```
User Registers → Account Created → JWT Token Issued → User Logged In → Full Access
```

### New Flow
```
User Registers → Account Created with Status="Pending" → No JWT Token → 
User Sees "Pending Verification" Message → Admin Reviews → 
Admin Approves → User Can Login → Full Access
```

---

## 📊 User Status States

Users should have the following status values:

1. **`pending`** - Newly registered, awaiting admin approval
2. **`active`** - Approved by admin, can access the application
3. **`revoked`** - Access revoked by admin (can be reactivated)
4. **`rejected`** - Registration rejected by admin (optional, or can use revoked)

---

## 🗄️ Database Schema Changes

### User Model Updates

The backend should update the User model to include:

```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String, // "SuperAdmin" | "Admin" | "Client" | "Designer"
  status: String, // "pending" | "active" | "revoked" | "rejected"
  credits: Number | "unlimited", // Number for credits or "unlimited" for admins
  createdAt: Date,
  updatedAt: Date,
  verifiedBy: ObjectId (optional), // Admin ID who verified the user
  verifiedAt: Date (optional), // When user was verified
  revokedBy: ObjectId (optional), // Admin ID who revoked access
  revokedAt: Date (optional) // When access was revoked
}
```

### Default Values on Registration
- `status`: `"pending"`
- `role`: `"Client"` (default role for new registrations)
- `credits`: `0` (or as per business logic)
- `createdAt`: Current timestamp

---

## 🔐 Authentication Changes

### Registration Endpoint (`POST /api/users`)

**Current Behavior:**
- Creates user account
- Returns JWT token in response header
- User is immediately logged in

**New Behavior:**
- Creates user account with `status: "pending"`
- **DO NOT** return JWT token
- Return success message: `"Registration successful. Your account is pending admin approval."`
- Return user object with `status: "pending"` (no sensitive data)

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201 Created):**
```json
{
  "message": "Registration successful. Your account is pending admin approval.",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "status": "pending",
    "role": "Client",
    "createdAt": "2025-01-15T10:30:00Z"
  }
}
```

**No JWT token in response header** (user cannot login until verified)

---

### Login Endpoint (`POST /api/auth`)

**Current Behavior:**
- Validates email/password
- Returns JWT token

**New Behavior:**
- Validate email/password
- **Check user status**
- **Only allow login if `status === "active"`**
- Return error if status is `"pending"`, `"revoked"`, or `"rejected"`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK) - Active User:**
```json
{
  "token": "jwt_token_here"
}
```

**Response (403 Forbidden) - Pending User:**
```json
{
  "error": "Your account is pending admin approval. Please wait for verification."
}
```

**Response (403 Forbidden) - Revoked User:**
```json
{
  "error": "Your account access has been revoked. Please contact administrator."
}
```

---

## 👥 User Management APIs (Admin Only)

### 1. Get All Users (`GET /api/users`)

**Access:** Admin/SuperAdmin only

**Query Parameters:**
- `status` (optional): Filter by status (`pending`, `active`, `revoked`, `rejected`)
- `role` (optional): Filter by role (`SuperAdmin`, `Admin`, `Client`, `Designer`)
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Items per page (default: 20)
- `search` (optional): Search by name or email

**Response (200 OK):**
```json
{
  "users": [
    {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "Client",
      "status": "pending",
      "credits": 0,
      "createdAt": "2025-01-15T10:30:00Z",
      "verifiedAt": null,
      "verifiedBy": null
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalUsers": 100,
    "pageSize": 20
  },
  "statistics": {
    "totalUsers": 100,
    "activeUsers": 85,
    "pendingUsers": 10,
    "revokedUsers": 5
  }
}
```

---

### 2. Verify User (`PATCH /api/users/:id/verify`)

**Access:** Admin/SuperAdmin only

**Action:** Changes user status from `pending` to `active`

**Request Body (optional):**
```json
{
  "role": "Client", // Optional: Set/change role during verification
  "credits": 100 // Optional: Set initial credits
}
```

**Response (200 OK):**
```json
{
  "message": "User verified successfully",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Client",
    "status": "active",
    "credits": 100,
    "verifiedAt": "2025-01-15T11:00:00Z",
    "verifiedBy": "admin_user_id"
  }
}
```

**Response (400 Bad Request):**
```json
{
  "error": "User is already verified"
}
```

**Response (404 Not Found):**
```json
{
  "error": "User not found"
}
```

---

### 3. Revoke User Access (`PATCH /api/users/:id/revoke`)

**Access:** Admin/SuperAdmin only

**Action:** Changes user status from `active` to `revoked`

**Response (200 OK):**
```json
{
  "message": "User access revoked successfully",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "status": "revoked",
    "revokedAt": "2025-01-15T12:00:00Z",
    "revokedBy": "admin_user_id"
  }
}
```

**Response (400 Bad Request):**
```json
{
  "error": "User is already revoked"
}
```

---

### 4. Reactivate User (`PATCH /api/users/:id/activate`)

**Access:** Admin/SuperAdmin only

**Action:** Changes user status from `revoked` to `active`

**Response (200 OK):**
```json
{
  "message": "User reactivated successfully",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "status": "active",
    "revokedAt": null,
    "revokedBy": null
  }
}
```

---

### 5. Reject User Registration (`PATCH /api/users/:id/reject`)

**Access:** Admin/SuperAdmin only

**Action:** Changes user status from `pending` to `rejected` (or delete user)

**Response (200 OK):**
```json
{
  "message": "User registration rejected",
  "user": {
    "_id": "user_id",
    "status": "rejected"
  }
}
```

**Alternative:** Delete user instead of rejecting (permanent deletion)

---

### 6. Delete User (`DELETE /api/users/:id`)

**Access:** Admin/SuperAdmin only

**Action:** Permanently delete user from database

**Response (200 OK):**
```json
{
  "message": "User deleted successfully"
}
```

**Response (400 Bad Request):**
```json
{
  "error": "Cannot delete SuperAdmin user"
}
```

---

### 7. Update User Role (`PATCH /api/users/:id/role`)

**Access:** Admin/SuperAdmin only

**Request Body:**
```json
{
  "role": "Admin" // "SuperAdmin" | "Admin" | "Client" | "Designer"
}
```

**Response (200 OK):**
```json
{
  "message": "User role updated successfully",
  "user": {
    "_id": "user_id",
    "role": "Admin"
  }
}
```

---

### 8. Update User Credits (`PATCH /api/users/:id/credits`)

**Access:** Admin/SuperAdmin only

**Request Body:**
```json
{
  "credits": 200, // Number or "unlimited"
  "operation": "set" // "set" | "add" | "subtract"
}
```

**Response (200 OK):**
```json
{
  "message": "User credits updated successfully",
  "user": {
    "_id": "user_id",
    "credits": 200
  }
}
```

---

## 🎨 Frontend Requirements

### 1. Registration Form Updates

**File:** `src/components/registerForm.jsx`

**Changes Needed:**
- After successful registration, **DO NOT** automatically log in user
- Show success message: "Registration successful! Your account is pending admin approval. You will be notified once your account is verified."
- Redirect to login page with a message
- Remove automatic JWT token handling

**New Flow:**
```javascript
doSubmit = async () => {
  try {
    const response = await userService.register(this.state.data);
    // Show success message
    toast.success("Registration successful! Your account is pending admin approval.");
    // Redirect to login
    this.props.history.push("/login");
  } catch (ex) {
    // Handle errors
  }
};
```

---

### 2. Login Form Updates

**File:** `src/components/loginForm.jsx`

**Changes Needed:**
- Handle new error responses for pending/revoked users
- Show appropriate error messages:
  - Pending: "Your account is pending admin approval. Please wait for verification."
  - Revoked: "Your account access has been revoked. Please contact administrator."

---

### 3. User Management Component

**File:** `src/components/userManagement.jsx` (New Component)

**Features:**
- Display list of all users (as shown in the image)
- Show user statistics (Total, Active, Pending)
- Filter by status (All, Pending, Active, Revoked)
- Search users by name/email
- Pagination
- Actions for each user:
  - **Verify** (for pending users) - Changes status to active
  - **Revoke** (for active users) - Changes status to revoked
  - **Activate** (for revoked users) - Changes status to active
  - **Delete** - Permanently delete user
  - **Edit Role** - Change user role
  - **Edit Credits** - Update user credits (with +/- buttons)

**Table Columns:**
- ID
- Email
- Name
- Role (with badge styling)
- Credits (with +/- buttons)
- Status (with badge styling)
- Created Date
- Actions (Verify/Revoke/Activate/Delete buttons)

**Status Badges:**
- `pending` - Orange badge
- `active` - Green badge
- `revoked` - Red badge
- `rejected` - Gray badge

**Role Badges:**
- `SuperAdmin` - Gray badge
- `Admin` - Blue badge
- `Client` - Green badge
- `Designer` - Purple badge

---

### 4. User Service Updates

**File:** `src/services/userService.js`

**New Functions Needed:**
```javascript
// Get all users (admin only)
export function getUsers(filters = {}) {
  const queryParams = new URLSearchParams(filters).toString();
  return http.get(apiEndpoint + (queryParams ? `?${queryParams}` : ""));
}

// Verify user
export function verifyUser(userId, data = {}) {
  return http.patch(`${apiEndpoint}/${userId}/verify`, data);
}

// Revoke user access
export function revokeUser(userId) {
  return http.patch(`${apiEndpoint}/${userId}/revoke`);
}

// Activate user
export function activateUser(userId) {
  return http.patch(`${apiEndpoint}/${userId}/activate`);
}

// Reject user
export function rejectUser(userId) {
  return http.patch(`${apiEndpoint}/${userId}/reject`);
}

// Delete user
export function deleteUser(userId) {
  return http.delete(`${apiEndpoint}/${userId}`);
}

// Update user role
export function updateUserRole(userId, role) {
  return http.patch(`${apiEndpoint}/${userId}/role`, { role });
}

// Update user credits
export function updateUserCredits(userId, credits, operation = "set") {
  return http.patch(`${apiEndpoint}/${userId}/credits`, { credits, operation });
}
```

---

### 5. Route Protection

**File:** `src/App.js`

**Add Route:**
```javascript
<AdminRoute path="/users" component={UserManagement} />
```

**Access:** Only Admin/SuperAdmin can access User Management page

---

## 🔔 Email Notifications (Optional - Future Enhancement)

Consider sending email notifications for:
- User registration (to admin)
- Account verification (to user)
- Account revocation (to user)
- Account reactivation (to user)

---

## 📝 Summary of Backend Requirements

### Required Endpoints:

1. ✅ `POST /api/users` - Registration (modified - no JWT on pending)
2. ✅ `POST /api/auth` - Login (modified - check status)
3. ✅ `GET /api/users` - Get all users (admin only, with filters)
4. ✅ `PATCH /api/users/:id/verify` - Verify pending user
5. ✅ `PATCH /api/users/:id/revoke` - Revoke active user
6. ✅ `PATCH /api/users/:id/activate` - Reactivate revoked user
7. ✅ `PATCH /api/users/:id/reject` - Reject pending user (optional)
8. ✅ `DELETE /api/users/:id` - Delete user
9. ✅ `PATCH /api/users/:id/role` - Update user role
10. ✅ `PATCH /api/users/:id/credits` - Update user credits

### Database Changes:

1. Add `status` field to User model (default: "pending")
2. Add `verifiedBy`, `verifiedAt` fields (optional)
3. Add `revokedBy`, `revokedAt` fields (optional)
4. Ensure `role` field exists (default: "Client")
5. Ensure `credits` field exists

### Middleware/Authorization:

1. Admin-only middleware for user management endpoints
2. Status check middleware for login endpoint
3. Role-based access control (SuperAdmin > Admin > Client)

---

## 🧪 Testing Checklist

### Backend Testing:

- [ ] Registration creates user with "pending" status
- [ ] Registration does NOT return JWT token
- [ ] Login fails for pending users
- [ ] Login fails for revoked users
- [ ] Login succeeds for active users
- [ ] Admin can view all users
- [ ] Admin can verify pending users
- [ ] Admin can revoke active users
- [ ] Admin can reactivate revoked users
- [ ] Admin can delete users
- [ ] Admin can update user roles
- [ ] Admin can update user credits
- [ ] Non-admin users cannot access user management endpoints
- [ ] SuperAdmin cannot be deleted
- [ ] Pagination works correctly
- [ ] Search/filter works correctly

### Frontend Testing:

- [ ] Registration shows success message and redirects to login
- [ ] Login shows appropriate error for pending users
- [ ] Login shows appropriate error for revoked users
- [ ] User Management page loads for admins only
- [ ] User list displays correctly
- [ ] Statistics display correctly
- [ ] Verify button works for pending users
- [ ] Revoke button works for active users
- [ ] Activate button works for revoked users
- [ ] Delete button works (with confirmation)
- [ ] Role update works
- [ ] Credits update works (add/subtract/set)
- [ ] Search functionality works
- [ ] Filter by status works
- [ ] Pagination works

---

## 🚀 Implementation Priority

### Phase 1 (Critical):
1. Update User model with `status` field
2. Modify registration endpoint (no JWT for pending)
3. Modify login endpoint (check status)
4. Create user management GET endpoint
5. Create verify endpoint

### Phase 2 (Important):
6. Create revoke/activate endpoints
7. Create delete endpoint
8. Create role/credits update endpoints
9. Frontend: Update registration form
10. Frontend: Update login form
11. Frontend: Create user management component

### Phase 3 (Enhancement):
12. Add search/filter functionality
13. Add pagination
14. Add email notifications
15. Add audit logging

---

## 📞 Questions for Backend Team

1. Should rejected users be deleted or marked as "rejected"?
2. What should be the default credits for new users?
3. Should SuperAdmin users be auto-verified on registration?
4. Do we need email notifications in Phase 1?
5. Should we track who verified/revoked users (verifiedBy, revokedBy)?
6. What are the exact role values? (SuperAdmin, Admin, Client, Designer - any others?)
7. Can users have multiple roles or just one?
8. Should credits be unlimited for SuperAdmin/Admin by default?

---

## 📄 Notes

- This document should be shared with the backend team for implementation
- Frontend will be updated once backend APIs are ready
- UI design matches the provided User Management dashboard image
- All admin operations should be logged for audit purposes (future enhancement)

