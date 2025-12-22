# Fix all import errors
$files = @(
    "src\pages\admin\AppointmentAnalytics.tsx",
    "src\pages\admin\PatientDemographics.tsx",
    "src\pages\doctor\DoctorPerformance.tsx",
    "src\pages\doctor\PrescriptionSignature.tsx",
    "src\pages\patient-portal\HealthSummary.tsx",
    "src\pages\patient-portal\MedicationAdherence.tsx",
    "src\pages\patient-portal\RecordDownload.tsx",
    "src\pages\patient-portal\SecureMessaging.tsx",
    "src\pages\patient-portal\SymptomChecker.tsx",
    "src\pages\patient-records\ImmunizationTracker.tsx",
    "src\pages\patient-records\PatientTimeline.tsx",
    "src\pages\patient-records\ProblemList.tsx",
    "src\pages\pharmacy\InventoryAnalytics.tsx",
    "src\pages\receptionist\billing\InsuranceClaims.tsx",
    "src\pages\receptionist\billing\PaymentPlans.tsx",
    "src\pages\receptionist\billing\RevenueReports.tsx",
    "src\pages\receptionist\Waitlist.tsx"
)

foreach ($file in $files) {
    $content = Get-Content $file -Raw
    $content = $content -replace "import Card from", "import { Card } from"
    $content = $content -replace "import Button from", "import { Button } from"
    $content = $content -replace "import Input from", "import { Input } from"
    $content = $content -replace "import Modal from", "import { Modal } from"
    Set-Content $file $content -NoNewline
    Write-Host "Fixed: $file"
}

Write-Host "All imports fixed!"
