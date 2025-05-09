// Doctor class to represent a doctor in the clinic
class Doctor {
  constructor(id, consultationTime, status = "notSeeing", currentConsultationTime = 0) {
    this.id = id
    this.consultationTime = consultationTime // Average consultation time in minutes
    this.status = status // 'notSeeing' or 'seeing'
    this.currentConsultationTime = currentConsultationTime // How long the current consultation has been going on
    this.patientQueue = [] // Queue of patients assigned to this doctor
  }

  // Calculate remaining time for current consultation
  getRemainingConsultationTime() {
    if (this.status === "notSeeing") {
      return 0
    }
    // If the doctor has spent more time than average, assume they'll finish soon (1 minute)
    if (this.currentConsultationTime >= this.consultationTime) {
      return 1
    }
    return this.consultationTime - this.currentConsultationTime
  }

  // Calculate total time to process all patients in this doctor's queue
  getTotalProcessingTime() {
    const remainingTime = this.getRemainingConsultationTime()
    return remainingTime + this.patientQueue.length * this.consultationTime
  }

  // Add a patient to this doctor's queue
  addPatient() {
    this.patientQueue.push({})
    return this.patientQueue.length
  }
}

// ClinicQueue class to manage the queue system
class ClinicQueue {
  constructor() {
    this.doctors = []
    this.totalPatients = 0
  }

  // Add a doctor to the clinic
  addDoctor(consultationTime, status = "notSeeing", currentConsultationTime = 0) {
    const id = this.doctors.length + 1
    const doctor = new Doctor(id, consultationTime, status, currentConsultationTime)
    this.doctors.push(doctor)
    return doctor
  }

  // Calculate waiting time for a new patient
  calculateWaitingTime(patientPosition) {
    // If no doctors, return 0
    if (this.doctors.length === 0) {
      return 0
    }

    // If only one doctor
    if (this.doctors.length === 1) {
      const doctor = this.doctors[0]
      const remainingTime = doctor.getRemainingConsultationTime()
      // Calculate based on position and consultation time
      return remainingTime + (patientPosition - 1) * doctor.consultationTime
    }

    // For multiple doctors, distribute patients optimally
    // First, simulate assigning all patients ahead in the queue
    const doctorsCopy = this.doctors.map((d) => ({
      id: d.id,
      consultationTime: d.consultationTime,
      status: d.status,
      currentConsultationTime: d.currentConsultationTime,
      totalTime: d.getRemainingConsultationTime(),
    }))

    // Assign each patient to the doctor with the shortest queue
    for (let i = 0; i < patientPosition - 1; i++) {
      // Find doctor with minimum total time
      const minTimeDoctor = doctorsCopy.reduce(
        (min, doc) => (doc.totalTime < min.totalTime ? doc : min),
        doctorsCopy[0],
      )

      // Assign patient to this doctor
      minTimeDoctor.totalTime += minTimeDoctor.consultationTime
    }

    // The patient's waiting time is the minimum total time among all doctors
    return Math.min(...doctorsCopy.map((d) => d.totalTime))
  }

  // Optimally distribute patients among doctors
  distributePatients(totalPatients) {
    // Reset all doctor queues
    this.doctors.forEach((doctor) => {
      doctor.patientQueue = []
    })

    // Distribute patients one by one to the doctor with the shortest processing time
    for (let i = 0; i < totalPatients; i++) {
      // Find doctor with minimum processing time
      const minTimeDoctor = this.doctors.reduce(
        (min, doc) => (doc.getTotalProcessingTime() < min.getTotalProcessingTime() ? doc : min),
        this.doctors[0],
      )

      // Assign patient to this doctor
      minTimeDoctor.addPatient()
    }
  }
}

// UI Event Handlers
document.addEventListener("DOMContentLoaded", () => {
  // Case 1: Single Doctor
  const doctorStatusSelect = document.getElementById("doctorStatus")
  const currentConsultTimeContainer = document.getElementById("currentConsultTimeContainer")

  doctorStatusSelect.addEventListener("change", function () {
    if (this.value === "seeing") {
      currentConsultTimeContainer.style.display = "block"
    } else {
      currentConsultTimeContainer.style.display = "none"
    }
  })

  document.getElementById("calculateCase1").addEventListener("click", () => {
    const consultTime = Number.parseFloat(document.getElementById("doctorConsultTime").value)
    const patientsAhead = Number.parseInt(document.getElementById("patientsAhead").value)
    const doctorStatus = document.getElementById("doctorStatus").value
    const currentConsultTime =
      doctorStatus === "seeing" ? Number.parseFloat(document.getElementById("currentConsultTime").value) : 0

    const clinic = new ClinicQueue()
    clinic.addDoctor(consultTime, doctorStatus, currentConsultTime)

    const waitingTime = clinic.calculateWaitingTime(patientsAhead + 1)

    const resultElement = document.getElementById("case1Result")
    resultElement.innerHTML = `
            <h5>Results:</h5>
            <p>Estimated waiting time: <strong>${waitingTime} minutes</strong></p>
            <p>Explanation:</p>
            <ul>
                <li>Doctor's consultation time: ${consultTime} minutes per patient</li>
                <li>Patients ahead: ${patientsAhead}</li>
                <li>Doctor status: ${doctorStatus === "seeing" ? "Currently seeing a patient" : "Not seeing any patient"}</li>
                ${doctorStatus === "seeing" ? `<li>Current consultation has been going on for: ${currentConsultTime} minutes</li>` : ""}
                ${doctorStatus === "seeing" ? `<li>Remaining time for current consultation: ${Math.max(0, consultTime - currentConsultTime)} minutes</li>` : ""}
            </ul>
            <p>The waiting time starts counting down when the patient joins the queue.</p>
        `
  })

  // Case 2: Multiple Doctors
  const doctorStatusSelects = document.querySelectorAll(".doctor-status")
  const currentConsultContainers = document.querySelectorAll(".current-consult-container")

  doctorStatusSelects.forEach((select, index) => {
    select.addEventListener("change", function () {
      if (this.value === "seeing") {
        currentConsultContainers[index].style.display = "block"
      } else {
        currentConsultContainers[index].style.display = "none"
      }
    })
  })

  document.getElementById("addDoctor").addEventListener("click", () => {
    const doctorsContainer = document.getElementById("doctorsContainer")
    const doctorCount = doctorsContainer.querySelectorAll(".doctor-entry").length

    const doctorEntry = document.createElement("div")
    doctorEntry.className = "doctor-entry mb-3"
    doctorEntry.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <label class="form-label">Doctor ${String.fromCharCode(65 + doctorCount)} Consultation Time (min)</label>
                    <input type="number" class="form-control doctor-time" value="3" min="1">
                </div>
                <div class="col-md-6">
                    <label class="form-label">Status</label>
                    <select class="form-select doctor-status">
                        <option value="notSeeing">Not Seeing Any Patient</option>
                        <option value="seeing">Currently Seeing a Patient</option>
                    </select>
                </div>
                <div class="col-md-12 current-consult-container" style="display: none;">
                    <label class="form-label">Current Consultation Duration (min)</label>
                    <input type="number" class="form-control current-consult-time" value="0" min="0">
                </div>
            </div>
        `

    doctorsContainer.appendChild(doctorEntry)

    // Add event listener to the new select
    const newSelect = doctorEntry.querySelector(".doctor-status")
    const newContainer = doctorEntry.querySelector(".current-consult-container")

    newSelect.addEventListener("change", function () {
      if (this.value === "seeing") {
        newContainer.style.display = "block"
      } else {
        newContainer.style.display = "none"
      }
    })
  })

  document.getElementById("removeDoctor").addEventListener("click", () => {
    const doctorsContainer = document.getElementById("doctorsContainer")
    const doctorEntries = doctorsContainer.querySelectorAll(".doctor-entry")

    if (doctorEntries.length > 1) {
      doctorsContainer.removeChild(doctorEntries[doctorEntries.length - 1])
    }
  })

  document.getElementById("calculateCase2").addEventListener("click", () => {
    const doctorEntries = document.querySelectorAll("#doctorsContainer .doctor-entry")
    const patientsAhead = Number.parseInt(document.getElementById("patientsAheadMulti").value)

    const clinic = new ClinicQueue()

    doctorEntries.forEach((entry, index) => {
      const consultTime = Number.parseFloat(entry.querySelector(".doctor-time").value)
      const status = entry.querySelector(".doctor-status").value
      const currentConsultTime =
        status === "seeing" ? Number.parseFloat(entry.querySelector(".current-consult-time").value) : 0

      clinic.addDoctor(consultTime, status, currentConsultTime)
    })

    const waitingTime = clinic.calculateWaitingTime(patientsAhead + 1)

    const resultElement = document.getElementById("case2Result")
    let doctorDetails = ""

    doctorEntries.forEach((entry, index) => {
      const consultTime = Number.parseFloat(entry.querySelector(".doctor-time").value)
      const status = entry.querySelector(".doctor-status").value
      const currentConsultTime =
        status === "seeing" ? Number.parseFloat(entry.querySelector(".current-consult-time").value) : 0

      doctorDetails += `
                <li>
                    Doctor ${String.fromCharCode(65 + index)}:
                    <ul>
                        <li>Consultation time: ${consultTime} minutes per patient</li>
                        <li>Status: ${status === "seeing" ? "Currently seeing a patient" : "Not seeing any patient"}</li>
                        ${status === "seeing" ? `<li>Current consultation has been going on for: ${currentConsultTime} minutes</li>` : ""}
                        ${status === "seeing" ? `<li>Remaining time for current consultation: ${Math.max(0, consultTime - currentConsultTime)} minutes</li>` : ""}
                    </ul>
                </li>
            `
    })

    resultElement.innerHTML = `
            <h5>Results:</h5>
            <p>Estimated waiting time: <strong>${waitingTime} minutes</strong></p>
            <p>Explanation:</p>
            <ul>
                <li>Patients ahead: ${patientsAhead}</li>
                <li>Doctors:
                    <ul>
                        ${doctorDetails}
                    </ul>
                </li>
            </ul>
            <p>The waiting time starts counting down when the patient joins the queue.</p>
        `
  })

  // Bonus: General Queue Calculator
  const bonusDoctorStatusSelects = document.querySelectorAll(".bonus-doctor-status")
  const bonusCurrentConsultContainers = document.querySelectorAll(".bonus-current-consult-container")

  bonusDoctorStatusSelects.forEach((select, index) => {
    select.addEventListener("change", function () {
      if (this.value === "seeing") {
        bonusCurrentConsultContainers[index].style.display = "block"
      } else {
        bonusCurrentConsultContainers[index].style.display = "none"
      }
    })
  })

  document.getElementById("addBonusDoctor").addEventListener("click", () => {
    const doctorsContainer = document.getElementById("bonusDoctorsContainer")
    const doctorCount = doctorsContainer.querySelectorAll(".doctor-entry").length

    const doctorEntry = document.createElement("div")
    doctorEntry.className = "doctor-entry mb-3"
    doctorEntry.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <label class="form-label">Doctor ${doctorCount + 1} Consultation Time (min)</label>
                    <input type="number" class="form-control bonus-doctor-time" value="3" min="1">
                </div>
                <div class="col-md-6">
                    <label class="form-label">Status</label>
                    <select class="form-select bonus-doctor-status">
                        <option value="notSeeing">Not Seeing Any Patient</option>
                        <option value="seeing">Currently Seeing a Patient</option>
                    </select>
                </div>
                <div class="col-md-12 bonus-current-consult-container" style="display: none;">
                    <label class="form-label">Current Consultation Duration (min)</label>
                    <input type="number" class="form-control bonus-current-consult-time" value="0" min="0">
                </div>
            </div>
        `

    doctorsContainer.appendChild(doctorEntry)

    // Add event listener to the new select
    const newSelect = doctorEntry.querySelector(".bonus-doctor-status")
    const newContainer = doctorEntry.querySelector(".bonus-current-consult-container")

    newSelect.addEventListener("change", function () {
      if (this.value === "seeing") {
        newContainer.style.display = "block"
      } else {
        newContainer.style.display = "none"
      }
    })
  })

  document.getElementById("removeBonusDoctor").addEventListener("click", () => {
    const doctorsContainer = document.getElementById("bonusDoctorsContainer")
    const doctorEntries = doctorsContainer.querySelectorAll(".doctor-entry")

    if (doctorEntries.length > 1) {
      doctorsContainer.removeChild(doctorEntries[doctorEntries.length - 1])
    }
  })

  document.getElementById("calculateBonus").addEventListener("click", () => {
    const doctorEntries = document.querySelectorAll("#bonusDoctorsContainer .doctor-entry")
    const patientsAhead = Number.parseInt(document.getElementById("bonusPatientsAhead").value)

    const clinic = new ClinicQueue()

    doctorEntries.forEach((entry, index) => {
      const consultTime = Number.parseFloat(entry.querySelector(".bonus-doctor-time").value)
      const status = entry.querySelector(".bonus-doctor-status").value
      const currentConsultTime =
        status === "seeing" ? Number.parseFloat(entry.querySelector(".bonus-current-consult-time").value) : 0

      clinic.addDoctor(consultTime, status, currentConsultTime)
    })

    const waitingTime = clinic.calculateWaitingTime(patientsAhead + 1)

    // Show detailed explanation of how patients are distributed
    clinic.distributePatients(patientsAhead)

    const resultElement = document.getElementById("bonusResult")
    let doctorDetails = ""

    clinic.doctors.forEach((doctor, index) => {
      doctorDetails += `
                <li>
                    Doctor ${index + 1}:
                    <ul>
                        <li>Consultation time: ${doctor.consultationTime} minutes per patient</li>
                        <li>Status: ${doctor.status === "seeing" ? "Currently seeing a patient" : "Not seeing any patient"}</li>
                        ${doctor.status === "seeing" ? `<li>Current consultation has been going on for: ${doctor.currentConsultationTime} minutes</li>` : ""}
                        ${doctor.status === "seeing" ? `<li>Remaining time for current consultation: ${doctor.getRemainingConsultationTime()} minutes</li>` : ""}
                        <li>Patients assigned to this doctor: ${doctor.patientQueue.length}</li>
                        <li>Total processing time: ${doctor.getTotalProcessingTime()} minutes</li>
                    </ul>
                </li>
            `
    })

    resultElement.innerHTML = `
            <h5>Results:</h5>
            <p>Estimated waiting time: <strong>${waitingTime} minutes</strong></p>
            <p>Explanation:</p>
            <ul>
                <li>Patients ahead: ${patientsAhead}</li>
                <li>Doctors:
                    <ul>
                        ${doctorDetails}
                    </ul>
                </li>
            </ul>
            <p>The waiting time starts counting down when the patient joins the queue.</p>
            <p>The algorithm optimally distributes patients among doctors to minimize waiting time.</p>
        `
  })
})
