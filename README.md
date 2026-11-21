
# Doctor Tracker – Frontend

A modern, responsive healthcare management dashboard developed using Next.js and React. The application provides a centralized administrative platform for managing doctors, organizing patient records, monitoring healthcare statistics, and handling secure administrator authentication.

## Features

### 1. Authentication & Authorization
- Administrator login.
- JWT-based authentication.
- Protected dashboard routes.
- Automatic redirection based on authentication status.
- Session verification.
- Secure logout functionality.
- Password visibility toggle.
- Login error handling.

### 2. Dashboard Management
- Healthcare statistics overview.
- Total doctors and patients.
- Doctor specialization statistics.
- Interactive dashboard charts.
- Visual representation of healthcare data.

### 3. Doctor Management
- Register new doctors.
- View all registered doctors.
- Deactivate doctor records.
- View patients assigned to individual doctors.
- Search doctors by name, email, hospital, phone, and specialization.
- Filter doctors by specialization.
- Filter doctors by registration date.
- Pagination.
- Refresh doctor records.

### 4. Patient Management
- Register new patients.
- Assign patients to doctors.
- View patient records.
- Remove patients from doctor assignments.
- Search and filter patient records.
- Patient statistics.
- Patient information management.

### 5. User Interface
- Fully responsive design.
- Modern healthcare-themed interface.
- Reusable React components.
- Responsive tables and mobile cards.
- Form validation.
- Interactive confirmation dialogs.
- Success and error notifications.
- Loading indicators.

## Technology Stack

| Technology | Purpose |
|---|---|
| Next.js | React framework |
| React | UI development |
| JavaScript | Application logic |
| Tailwind CSS | Styling |
| DaisyUI | UI components |
| Lucide React | Icons |
| React Context API | Global state management |
| Axios | HTTP requests |
| React Hook Form | Form management |
| Zod | Form validation |
| SweetAlert2 | Alerts and notifications |

## Project Structure

```text
doctor-tracker-frontend/
│
├── public/
│
├── src/
│   │
│   ├── app/
│   │   ├── dashboard/
│   │   │   └── page.jsx
│   │   │
│   │   ├── doctors/
│   │   │   └── page.jsx
│   │   │
│   │   ├── login/
│   │   │   └── page.jsx
│   │   │
│   │   ├── patients/
│   │   │   └── page.jsx
│   │   │
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.jsx
│   │   └── page.js
│   │
│   ├── components/
│   │   │
│   │   ├── auth/
│   │   │   ├── AuthInputField.jsx
│   │   │   ├── AuthLayout.jsx
│   │   │   ├── AuthPasswordField.jsx
│   │   │   ├── LogoutButton.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── common/
│   │   │   ├── FormField.jsx
│   │   │   └── StatCard.jsx
│   │   │
│   │   ├── dashboard/
│   │   │   └── DashboardCharts.jsx
│   │   │
│   │   ├── doctors/
│   │   │   ├── DoctorFilters.jsx
│   │   │   ├── DoctorFormModal.jsx
│   │   │   ├── DoctorPagination.jsx
│   │   │   ├── DoctorPatientsModal.jsx
│   │   │   ├── DoctorStats.jsx
│   │   │   ├── DoctorTable.jsx
│   │   │   ├── PatientCard.jsx
│   │   │   └── PatientForm.jsx
│   │   │
│   │   ├── layout/
│   │   │   └── AdminLayout.jsx
│   │   │
│   │   ├── patients/
│   │   │   ├── PatientFilters.jsx
│   │   │   ├── PatientFormModal.jsx
│   │   │   ├── PatientStats.jsx
│   │   │   └── PatientTable.jsx
│   │   │
│   │   ├── providers/
│   │   │   └── AppProviders.jsx
│   │   │
│   │   └── ui/
│   │
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── HealthcareContext.jsx
│   │
│   ├── data/
│   │   ├── dashboardData.js
│   │   └── doctorsData.js
│   │
│   ├── hooks/
│   │
│   ├── lib/
│   │   ├── api.js
│   │   ├── axios.js
│   │   └── sweetAlert.js
│   │
│   └── services/
│       ├── authService.js
│       ├── dashboardApi.js
│       ├── doctorApi.js
│       └── patientApi.js
│
├── .gitignore
├── eslint.config.mjs
├── jsconfig.json
├── next.config.mjs
├── package.json
├── package-lock.json
└── README.md
```

## Requirements

Make sure the following tools are installed:

- Node.js (LTS version recommended).
- npm.
- Git.
- Doctor Tracker Backend API.

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/faisalahmed3/doctor-tracker-frontend.git
```

### 2. Navigate to the Project Directory

```bash
cd doctor-tracker-frontend
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the project root.

Example configuration:

```env
NEXT_PUBLIC_API_URL=https://doctor-tracker-backend-teal.vercel.app/api/v1
```

Make sure the variable name matches the one referenced in your API configuration files.

## Running the Application

### Development

```bash
npm run dev
```

The application will be available at:

http://localhost:3000

### Production Build

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

These commands require the corresponding scripts to be configured in `package.json`.

## Application Architecture

### 1. App Router

The application uses the Next.js App Router for page routing.

| Route | Description |
|---|---|
| `/` | Application home page |
| `/login` | Administrator login |
| `/dashboard` | Healthcare dashboard |
| `/doctors` | Doctor management |
| `/patients` | Patient management |

### 2. Components

The components directory contains reusable UI elements organized by functionality.

- `auth/` – Authentication forms, layouts, logout, and route protection.
- `common/` – Reusable form fields and statistics cards.
- `dashboard/` – Dashboard charts.
- `doctors/` – Doctor management, filters, forms, tables, and patient assignment components.
- `layout/` – Main administrative layout.
- `patients/` – Patient management forms, filters, statistics, and tables.
- `providers/` – Application-wide context providers.
- `ui/` – Shared UI component directory.

### 3. Context API

The application uses React Context API for global state management.

**AuthContext.jsx**

Handles:
- Administrator authentication.
- Login and logout.
- Authentication status.
- Session verification.
- Authentication errors.

**HealthcareContext.jsx**

Handles:
- Doctor records.
- Patient records.
- Doctor creation and deactivation.
- Patient creation and deletion.
- Loading and mutation states.
- API error management.
- Data refreshing.

### 4. Services

The services directory separates API communication from UI components.

| File | Responsibility |
|---|---|
| `authService.js` | Authentication API operations |
| `dashboardApi.js` | Dashboard data retrieval |
| `doctorApi.js` | Doctor-related API operations |
| `patientApi.js` | Patient-related API operations |

### 5. Libraries

The lib directory contains shared application utilities.

| File | Responsibility |
|---|---|
| `api.js` | Shared API configuration |
| `axios.js` | HTTP client configuration |
| `sweetAlert.js` | Confirmation dialogs and notifications |

### 6. Data

The data directory contains application data modules.

- `dashboardData.js`
- `doctorsData.js`

## Backend Integration

The frontend communicates with the Doctor Tracker backend through REST API requests.

Default development configuration:

| Application | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend | http://localhost:5000 |
| API Base URL | https://doctor-tracker-backend-teal.vercel.app/api/v1 |
| Database | MongoDB Atlas |

The backend handles database operations, administrator authentication, doctor records, and patient records.

## Form Validation

React Hook Form and Zod are used for form management and validation where configured.

Doctor registration validates:
- Doctor name.
- Specialization.
- Hospital name.
- Phone number.
- Email address.

Patient registration validates:
- Patient name.
- Age.
- Medical condition.

## Responsive Design

The application supports different screen sizes.

- Desktop: Full administrative dashboard with tables and navigation.
- Tablet: Adaptable layouts and responsive content.
- Mobile: Mobile-friendly navigation, cards, and forms.

Tailwind CSS and DaisyUI are used to implement the responsive interface.

## Security Considerations

- Never expose backend credentials in frontend code.
- Keep environment files out of Git.
- Use HTTPS in production.
- Protect administrative routes.
- Validate sensitive operations on the backend.
- Do not expose JWT secrets through `NEXT_PUBLIC_` variables.
- Configure backend CORS for trusted frontend domains.

## Deployment

To deploy the frontend:

1. Push the source code to GitHub.
2. Connect the repository to a Next.js-compatible hosting platform.
3. Configure the production API URL.
4. Ensure the backend allows the deployed frontend domain.
5. Build and deploy the application.
6. Test authentication and all management modules.

## License

This project is developed for the Doctor Tracker Healthcare Management System.

All rights reserved.

---

**Doctor Tracker – Healthcare Management System**

*Better care starts with better organization.*
