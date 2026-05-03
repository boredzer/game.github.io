export default async function handler(req, res) {
    // 1. ตรวจสอบ Method
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'ใช้ POST เท่านั้น' });
    }

    try {
        const { code } = req.body;
        const CLIENT_ID = '1499862278487539722';
        const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;

        // 2. เช็คว่าตั้งค่า Environment Variable หรือยัง
        if (!CLIENT_SECRET) {
            return res.status(500).json({
                error: 'ยังไม่ได้ตั้งค่า DISCORD_CLIENT_SECRET ใน Vercel Settings'
            });
        }

        // เพิ่มก่อนบรรทัด fetch
        console.log("Client ID:", CLIENT_ID);
        console.log("Secret Length:", CLIENT_SECRET ? CLIENT_SECRET.length : 0);


        const response = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                grant_type: 'authorization_code',
                code: code.toString(), // ตรวจสอบว่า code ไม่เป็น undefined
                redirect_uri: 'https://game-github-io-sepia.vercel.app/'
            }),
        });

        const data = await response.json();
        console.log("Discord Response:", data); // ดูว่า Discord ตอบอะไรกลับมา

        // --- แก้ไขส่วนนี้ ---
        if (response.ok) {
            return res.status(200).json({
                token: data.access_token, // เปลี่ยนชื่อจาก access_token เป็น token ให้ Unity อ่านออก
                expires_in: data.expires_in
            });
        } else {
            return res.status(response.status).json(data);
        }
        // ------------------

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}