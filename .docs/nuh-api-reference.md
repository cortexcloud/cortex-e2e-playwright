# NUH API Reference — Create Patient (HN) และ Create Visit

จับจาก Chrome DevTools Network log ของเบราว์เซอร์จริง (ไม่ใช่ inspect source code) ระหว่างทำ flow
สร้างผู้ป่วยทดสอบใหม่ 2 คน (HN 69007787, 69007789) ซ้ำ

**ข้อจำกัดสำคัญ**: เห็นแค่ `URL` / `method` / `statusCode` เท่านั้น **ไม่เห็น request/response body**
เพราะงั้นสำหรับ endpoint ที่เป็น GraphQL จะบอกได้แค่ว่ามันถูกเรียก ไม่สามารถบอก operation name หรือ
query/mutation จริงได้ (ลองแทรก fetch-interceptor เพื่อดัก body แล้วแต่ GraphQL client ของแอปจับ
reference ของ `fetch` ไปตั้งแต่ก่อนโหลดเสร็จ เลยดักไม่ทัน)

---

## 1) สร้าง HN (Create Patient)

Backend หลักที่ใช้: GraphQL (มี 1 call ต่อการสร้าง 1 ครั้ง) ส่วนที่เหลือเป็น REST call สำหรับโหลด
ข้อมูลกลับมาแสดงหลัง redirect ไปหน้า profile

| Method | Endpoint | หน้าที่ |
|---|---|---|
| POST | `/cortex-api/graphql` | การสร้างผู้ป่วยจริง (mutation) — ไม่ทราบ operation name เพราะดู body ไม่ได้ |
| GET | `/new-demographic-api/patients/{HN}?include=RelatedPerson` | ดึงข้อมูลผู้ป่วยที่เพิ่งสร้าง มาแสดงหน้า profile |
| GET | `/new-demographic-api/patients/{HN}/photo` | รูปโปรไฟล์ผู้ป่วย |
| GET | `/new-demographic-api/patients/{internalId}/audit-events?event-type=OFFICIAL_CHANGE_PATIENT_NAME` | ประวัติการแก้ชื่อ (เช็คว่ามี audit trail ไหม) |
| GET | `/new-demographic-api/patients/{internalId}/audit-events?event-type=OFFICIAL_UPDATE_PASSPORT` | ประวัติการแก้เลขบัตร/พาสปอร์ต |
| GET | `/generated-emr-api/flags?filter[hn][equals]={HN}` | flag พิเศษของผู้ป่วย (เช่น VIP, แพ้ยา) |
| GET | `/generated-emr-api/rpc/single-response/outstanding-balance-by-hn?filter[hn][equals]={HN}` | ยอดค้างชำระ |
| GET | `/cortex-api/patient/{HN}/links` | ลิงก์ที่เกี่ยวข้องกับผู้ป่วย (เช่น admission/visit ปัจจุบัน) |
| GET | `/emr-api/patients/{HN}/visits/status-count` | จำนวน/สถานะ visit ของผู้ป่วย |
| GET | `/cortex-api/config`, `/cortex-api/permissions/me` | config + สิทธิ์ผู้ใช้งาน (โหลดตอน mount แอป ไม่เกี่ยวกับ patient โดยตรง) |

`internalId` ในสอง `audit-events` endpoint เป็น UUID รูปแบบ `1a0192f0-...` (ไม่ใช่ HN) — ต้องได้มาจาก
response ของ `GET patients/{HN}` ก่อน (ไม่ทราบ field name แน่ชัดเพราะไม่เห็น response body ผ่าน
เครื่องมือนี้)

---

## 2) สร้าง Visit (Create Visit)

ซับซ้อนกว่า มี GraphQL หลาย call (ดูเหมือนมีทั้ง query โหลด option และ mutation จริง ปนกัน แยกไม่ออก
จาก log อย่างเดียว) บวก REST call เฉพาะทางอีกหลายตัว

### โหลดข้อมูลสำหรับฟอร์ม (ก่อนกด "สร้าง")

| Method | Endpoint | หน้าที่ |
|---|---|---|
| GET | `/generated-emr-api/clinics?filter[active][equals]=true&...` | รายการคลินิกสำหรับ dropdown "Walk-in ไป คลินิก" |
| GET | `/generated-emr-api/queue-types` | ประเภทคิว |
| GET | `/generated-emr-api/appointment-with-clinic-department-and-practitioners?filter[patientHn][equals]={HN}&filter[currentStatus][equals]=BOOKED` | เช็คว่าผู้ป่วยมีนัดหมาย (BOOKED) วันนี้อยู่แล้วไหม |
| GET | `/generated-emr-api/insurance-plans?filter[active][equals]=true` | รายการสิทธิการรักษาไว้เลือกเพิ่ม |
| GET | `/generated-emr-api/document-type-with-groups` | ประเภทเอกสารที่เกี่ยวข้อง |
| GET | `/generated-emr-api/practitioners?filter[active][equals]=true` | รายชื่อแพทย์ |
| GET | `/generated-emr-api/visit-types?filter[active][equals]=true` | ประเภท visit |
| GET | `/generated-emr-api/hospitals?filter[code][equals]=11656` | ข้อมูลโรงพยาบาลปัจจุบัน (11656 = รหัส รพ.) |
| GET | `/generated-emr-api/imaging-appointments?filter[currentStatus][in]=PROPOSED` | นัด imaging ที่ proposed ไว้ |
| GET | `/generated-emr-api/activity-appointments?filter[currentStatus][in]=PROPOSED` | นัด activity อื่น ๆ ที่ proposed ไว้ |
| GET | `/generated-emr-api/esi-triages` | ระดับ ESI triage (สำหรับตั้งค่า default) |

### ตอนกด "สร้าง" (การสร้าง visit จริง)

| Method | Endpoint | หน้าที่ |
|---|---|---|
| POST | `/cortex-api/graphql` | การสร้าง visit จริง (mutation) — เรียกซ้ำหลายครั้งปนกับ query อื่น แยก operation ไม่ได้จาก log |
| PUT | `/cortex-api/encounters/{EN}/triage` | ตั้งค่า triage level เริ่มต้นให้ encounter ที่เพิ่งสร้าง (EN เช่น `E6908191658`) |
| GET | `/cortex-api/feature-flags?key=opd.visit.pending-check-in` | เช็ค feature flag เกี่ยวกับ pending check-in |
| GET | `/cortex-api/feature-flags?key=reception.visit-slip.print` | เช็คว่าเปิดใช้ auto-print ใบนำทางไหม |
| POST | `/cortex-api/visits/{VN}/visit-slip/print` | สั่งสร้างใบนำทาง (VN เช่น `V6908191310`) — เรียก backend สำเร็จ (200) |
| GET | `/emr-api/patients/{HN}/visits/status-count` | refresh จำนวน visit ของผู้ป่วยหลังสร้างเสร็จ |

---

## Root cause ของ error "พิมพ์ใบนำทางไม่สำเร็จ" (ยืนยันแล้ว)

```
POST http://localhost:8081/print?printer=thermal&size=A5&orientation=portrait
→ 503 Service Unavailable
```

นี่คือสาเหตุจริงของ error toast ที่เจอตอน demo — **ไม่ใช่ bug ของ backend Cortex** แต่เป็นการเรียก
local print agent ที่รันอยู่บนเครื่อง client (`localhost:8081`, thermal printer service สำหรับ
เครื่องพิมพ์ใบนำทางที่เคาน์เตอร์) ซึ่งไม่มีรันอยู่ในสภาพแวดล้อมทดสอบนี้

Flow จริง: เรียก backend `/visits/{VN}/visit-slip/print` (200 สำเร็จ) เพื่อสร้างเนื้อหาใบนำทางก่อน
แล้วค่อยส่งต่อไป local print agent เพื่อสั่งพิมพ์จริงที่เครื่องพิมพ์ — **ขั้นตอนหลังนี้แหละที่ fail**
เพราะไม่มี print agent ให้เชื่อมต่อ

**สรุปสำหรับ automation**:
- ถ้าเขียนเทสสร้าง visit **ไม่ควร assert error จาก print step นี้เด็ดขาด** (ตรงกับที่เขียนไว้ใน
  [pages/visit/VisitPage.js](../pages/visit/VisitPage.js) `submitVisitForm()` อยู่แล้ว)
- ถ้าอยาก mock/stub เพื่อไม่ให้ error toast โผล่กวน flow ก็ mock ที่ `http://localhost:8081/print`
  ได้ตรง ๆ (เช่นผ่าน `page.route()`)

---

## ข้อจำกัดของการสำรวจนี้ / ขั้นตอนถัดไปถ้าต้องการ payload จริง

เครื่องมือที่ใช้ (network log ผ่านเบราว์เซอร์) เห็นแค่ URL/method/status ไม่เห็น request/response
body ดังนั้น **operation name และ input schema ของ GraphQL mutation** ("createPatient",
"createVisit" หรือชื่อจริงคืออะไร) **ยังไม่ทราบแน่ชัด**

ถ้าต้องการ payload/schema ที่แน่นอนของ GraphQL mutation แนะนำ:
1. เปิด Chrome DevTools (F12) → tab Network → กรอง `graphql` → ทำ flow สร้างผู้ป่วย/visit จริง
   แล้วดู Request Payload ของแต่ละ POST ได้ตรง ๆ
2. หรือถ้ามี GraphQL schema/introspection endpoint เปิดอยู่ ลอง query `__schema` ที่
   `/cortex-api/graphql` เพื่อดู mutation ทั้งหมดที่มี

**สำรวจเมื่อ**: 2026-08-20 (สร้างผู้ป่วยทดสอบ HN 69007787, 69007789 ตอนจับ log)
