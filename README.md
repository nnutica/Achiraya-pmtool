



# 🛠 Achiraya Project Management Tool

A lightweight and customizable project management application inspired by **JIRA** and **Trello** — built with modern technologies for speed, flexibility, and cost-efficiency.

เครื่องมือจัดการโปรเจคที่พัฒนาขึ้นโดยมีแนวคิดจาก **JIRA** และ **Trello** — เน้นความเร็ว ความยืดหยุ่น และไม่ต้องเสียค่าใช้จ่ายเพิ่มเติม

---

## 📦 Tech Stack / เทคโนโลยีที่ใช้

- **Frontend**: Next.js + Tailwind CSS  
- **Backend**: Next.js API Routes + Firebase  
- **Database**: Firebase Firestore  

---

## 🎯 Purpose / จุดประสงค์

เนื่องจาก JIRA มีค่าใช้จ่ายสูงและมีความช้าบางครั้ง โปรเจกต์นี้จึงเกิดขึ้นเพื่อพัฒนาเครื่องมือที่มีความสามารถคล้ายกัน แต่ปรับแต่งได้และทำงานรวดเร็ว เหมาะสำหรับทีมขนาดเล็กถึงกลาง

This project was created as a fast and affordable alternative to JIRA, focusing on essential project management features with full customization for small to mid-sized teams.

---

## 🧭 Project Boundary / ขอบเขตของโปรเจค

### 🇹🇭 ภาษาไทย

- ผู้ใช้สามารถ:
  - เพิ่ม ดู แก้ไข และลบโปรเจคของตนเอง
  - เพิ่มสมาชิกในโปรเจคได้แบบ Manual
  - ตั้ง Due Date สำหรับแต่ละโปรเจค

### 🇺🇸 English

- Users can:
  - Create, read, update, and delete their own projects
  - Manually invite members to a project
  - Set due dates for each project

---

## ✅ Task Boundary / ขอบเขตของงาน (Task)

### 🇹🇭 ภาษาไทย

- งาน (Task) จะถูกผูกกับโปรเจคเสมอ
- ผู้ใช้สามารถ:
  - เพิ่ม ดู แก้ไข ลบ Task ภายในโปรเจคของตน
  - มอบหมายงานให้สมาชิกภายในโปรเจคนั้นได้

### 🇺🇸 English

- Tasks are always associated with a project
- Users can:
  - Create, view, update, and delete tasks within their projects
  - Assign tasks to members within the same project

---

## 📊 Dashboard Boundary / ขอบเขตของแดชบอร์ด

### 🇹🇭 ภาษาไทย

- แดชบอร์ดสามารถ:
  - แสดงสรุปของโปรเจคตามสถานะ
  - เข้าถึงโปรเจคได้อย่างรวดเร็ว (Quick Access)
  - สร้างโปรเจคใหม่แบบทางลัด

### 🇺🇸 English

- The dashboard provides:
  - Summary of projects categorized by status
  - Quick access to project pages
  - Fast project creation via shortcut

---

## 🚀 Getting Started / เริ่มต้นใช้งาน

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---



## 📄 License

This project is licensed under the NUT License.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
