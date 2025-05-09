# Clinic Queue System Documentation

## Table of Contents
- [Overview](#overview)
- [Installation](#installation)
- [Features](#features)
- [Technical Implementation](#technical-implementation)
- [Usage Guide](#usage-guide)
- [Case Studies Explained](#case-studies-explained)
- [Algorithm Explanation](#algorithm-explanation)
- [Future Improvements](#future-improvements)

## Overview

The Clinic Queue System is an online queuing solution for clinics that only accept walk-in patients. This system allows patients to queue online and receive real-time updates about their waiting time. Unlike appointment systems, patients cannot select preferred time slots but instead secure a spot in the queue with estimated waiting times based on their position and doctor availability.

The system calculates waiting times based on:
1. The average consultation time of doctors
2. The number of patients ahead in the queue
3. Whether doctors are currently seeing patients
4. How long current consultations have been going on

## Installation

This is a pure JavaScript application with Bootstrap for styling. No build tools or package managers are required.

### Prerequisites
- A modern web browser
- Internet connection (for loading Bootstrap CDN)

### Setup
1. Download all project files
2. Open `index.html` in your web browser
3. No server setup is required as this is a client-side application

## Features

- **Single Doctor Queue Calculation**: Calculate waiting times for clinics with one doctor
- **Multiple Doctors Queue Calculation**: Calculate waiting times for clinics with multiple doctors
- **Real-time Updates**: Waiting times are calculated based on current queue status
- **Dynamic Doctor Management**: Add or remove doctors to test different clinic configurations
- **Detailed Explanations**: View detailed breakdowns of waiting time calculations
- **Optimal Patient Distribution**: Algorithm distributes patients optimally among doctors

## Technical Implementation

### Core Classes

#### Doctor Class
\`\`\`javascript
class Doctor {
  constructor(id, consultationTime, status = "notSeeing", currentConsultationTime = 0) {
    this.id = id
    this.consultationTime = consultationTime // Average consultation time in minutes
    this.status = status // 'notSeeing' or 'seeing'
    this.currentConsultationTime = currentConsultationTime // How long the current consultation has been going on
    this.patientQueue = [] // Queue of patients assigned to this doctor
  }
  
  // Methods for calculating remaining time, processing time, etc.
}
\`\`\`

#### ClinicQueue Class
\`\`\`javascript
class ClinicQueue {
  constructor() {
    this.doctors = []
    this.totalPatients = 0
  }
  
  // Methods for adding doctors, calculating waiting time, distributing patients, etc.
}
\`\`\`

### Key Algorithms

1. **Waiting Time Calculation**: Determines how long a patient will wait based on their position in the queue and doctor availability
2. **Patient Distribution**: Optimally assigns patients to doctors to minimize waiting times
3. **Remaining Consultation Time**: Calculates how much longer a current consultation will take

## Usage Guide

### Case Study 1: Single Doctor

1. Enter the doctor's average consultation time (default: 3 minutes)
2. Enter the number of patients ahead (default: 5)
3. Select the doctor's status (seeing a patient or not)
4. If the doctor is seeing a patient, enter how long the consultation has been going on
5. Click "Calculate Waiting Time" to see the results

### Case Study 2: Multiple Doctors

1. For each doctor, enter their average consultation time
2. Select each doctor's status
3. If a doctor is seeing a patient, enter how long the consultation has been going on
4. Enter the number of patients ahead
5. Click "Calculate Waiting Time" to see the results
6. Use "Add Another Doctor" or "Remove Doctor" buttons to adjust the number of doctors

### Bonus Calculator

1. Add as many doctors as needed using the "Add Another Doctor" button
2. Configure each doctor's consultation time and status
3. Enter the number of patients ahead
4. Click "Calculate Waiting Time" to see detailed results including how patients are distributed

## Case Studies Explained

### Case Study 1: Single Doctor

**Scenario**: Clinic X has 1 doctor with an average consultation time of 3 minutes per patient. John is the 6th patient in the queue with 5 patients ahead of him.

**Question 1**: When should the countdown in waiting time start for John?
- **Answer**: The countdown should start the moment John joins the queue. The system calculates and displays the waiting time immediately.

**Question 2**: Waiting time when doctor is already seeing a patient:
- **Answer (a)**: If the doctor has been with a patient for 2 minutes (out of 3 minutes average):
  - Remaining time for current patient = 1 minute
  - Time for 4 other patients ahead = 12 minutes
  - Total waiting time = 13 minutes
  
- **Answer (b)**: If the doctor has been with a patient for 5 minutes (exceeding the 3 minutes average):
  - Since the consultation has already exceeded the average time, we assume it will finish soon (1 minute)
  - Time for 4 other patients ahead = 12 minutes
  - Total waiting time = 13 minutes

### Case Study 2: Multiple Doctors

**Scenario**: Clinic Y has 2 doctors with average consultation times of 3 minutes (Doctor A) and 4 minutes (Doctor B). John is the 11th patient with 10 patients ahead of him.

**Question 1**: Waiting time with both doctors available:
- **Answer**: The system optimally distributes patients to minimize waiting time. With 10 patients ahead:
  - Doctor A (faster) will handle 6 patients (18 minutes)
  - Doctor B will handle 4 patients (16 minutes)
  - John will be assigned to Doctor B after the 4 patients
  - Total waiting time = 16 minutes

**Question 2**: Waiting time when Doctor B is already seeing a patient:
- **Answer**: If Doctor B has been with a patient for 2 minutes (out of 4 minutes average):
  - Remaining time for current patient with Doctor B = 2 minutes
  - Doctor A (available) will handle 6 patients (18 minutes)
  - Doctor B will handle 3 more patients after current one (12 minutes)
  - Total for Doctor B = 14 minutes
  - John will be assigned to Doctor B
  - Total waiting time = 14 minutes

## Algorithm Explanation

The core algorithm for calculating waiting times works as follows:

1. **For a single doctor**:
   - If the doctor is not seeing a patient: `waitingTime = patientsAhead * consultationTime`
   - If the doctor is seeing a patient: `waitingTime = remainingConsultationTime + (patientsAhead - 1) * consultationTime`

2. **For multiple doctors**:
   - Create a copy of the doctors array with their current status
   - Simulate assigning each patient ahead in the queue to the doctor with the shortest total processing time
   - After all patients ahead are assigned, the patient's waiting time is the minimum total time among all doctors

3. **Optimal patient distribution**:
   - Always assign the next patient to the doctor who will finish their current queue first
   - This greedy approach ensures minimum waiting time for all patients

## Future Improvements

1. **Real-time Updates**: Implement WebSockets for real-time updates to waiting times
2. **Patient Preferences**: Allow patients to specify doctor preferences
3. **Priority Queue**: Implement priority for emergency cases
4. **Historical Data**: Use historical data to improve consultation time estimates
5. **Mobile App**: Develop a mobile application for patients to queue remotely
6. **Admin Dashboard**: Create an admin interface for clinic staff to manage the queue
7. **Notifications**: Send SMS or email notifications when a patient's turn is approaching
8. **Analytics**: Add reporting features to analyze clinic efficiency

---

© 2023 Clinic Queue System. All rights reserved.
