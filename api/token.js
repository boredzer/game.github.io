export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { code } = req.body;
    // ดึงค่า Client ID จากโค้ด Unity ของคุณ และ Secret จาก Vercel Environment Variables
    const CLIENT_ID = '1488362270487539722'; // ตามที่เห็นในรูปโค้ดของคุณ
    const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET; 

    try {
        const response = await fetch('https://discord.com', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                grant_type: 'authorization_code',
                code: code,
            }),
        });

        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch token' });
    }
}
