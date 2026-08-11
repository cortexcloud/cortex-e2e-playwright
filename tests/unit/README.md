# ไดเรกทอรีสำหรับ Unit Tests (`tests/unit/`)

ไดเรกทอรีนี้เก็บ **Unit Test Specs** สำหรับทดสอบฟังก์ชัน Pure JavaScript ที่อยู่ในโฟลเดอร์ [`utils/`](../../utils/)

## วัตถุประสงค์และขอบเขตการทดสอบ

- **ตรวจสอบความถูกต้องของฟังก์ชัน (Functionality Verification)**: ทดสอบว่าฟังก์ชันคำนวณและสร้างข้อมูล เช่น สุ่มเลขบัตรประชาชน 13 หลัก (สูตร Modulo 11), การแปลงปี พ.ศ. เกิดจากอายุ และการบันทึกข้อมูลผู้ป่วยลง JSON ทำงานได้อย่างถูกต้อง
- **ประมวลผลรวดเร็ว (Fast Execution)**: รันผ่าน Node.js โดยไม่ต้องเปิดหน้าต่างเบราว์เซอร์จริง (ใช้เวลาประมวลผลเพียงมิลลิวินาที)
- **ป้องกัน Regression Bug**: ช่วยดักจับความผิดพลาดของ Logic ใน `utils/` ก่อนนำไปใช้ในชุด E2E Test หลัก

## ตารางการจับคู่ไฟล์ (Directory Mapping)

| ฟังก์ชันต้นทาง (`utils/`) | ไฟล์ทดสอบ Unit Test (`tests/unit/`) | คำอธิบายสิ่งที่ทดสอบ |
| --- | --- | --- |
| [`utils/identityGenerator.js`](file:///Users/neranchara/Jobs/Project/cortex-e2e-playwright/utils/identityGenerator.js) | [`tests/unit/identityGenerator.spec.js`](file:///Users/neranchara/Jobs/Project/cortex-e2e-playwright/tests/unit/identityGenerator.spec.js) | ตรวจสอบสูตร Checksum Modulo 11 ของเลขบัตรประชาชน 13 หลัก และรูปแบบเลข Passport |
| [`utils/patientGenerator.js`](file:///Users/neranchara/Jobs/Project/cortex-e2e-playwright/utils/patientGenerator.js) | [`tests/unit/patientGenerator.spec.js`](file:///Users/neranchara/Jobs/Project/cortex-e2e-playwright/tests/unit/patientGenerator.spec.js) | ตรวจสอบการสุ่มข้อมูลผู้ป่วย, การคำนวณอายุ และการแปลงปี พ.ศ. เกิด |
| [`utils/patientStorage.js`](file:///Users/neranchara/Jobs/Project/cortex-e2e-playwright/utils/patientStorage.js) | [`tests/unit/patientStorage.spec.js`](file:///Users/neranchara/Jobs/Project/cortex-e2e-playwright/tests/unit/patientStorage.spec.js) | ตรวจสอบการอ่านและบันทึกข้อมูลผู้ป่วยลงไฟล์ JSON โดยไม่ให้เขียนทับข้อมูลเดิม |

## คำสั่งการรันทดสอบ

รัน Unit Tests ทั้งหมดในโฟลเดอร์นี้:

```bash
npm run test:unit
```

รันเฉพาะไฟล์ Unit Test ที่ต้องการ:

```bash
npx playwright test tests/unit/identityGenerator.spec.js
```
