async function checkStudent(req, res, next) {
    try {
        // Retrieve cookie value
        const accessToken = req.cookies.btp_student_accessToken;

        if (!accessToken) {
            return res.status(408).json({ msg: 'Access token not found in cookie' });
        }

        const url = 'https://graph.microsoft.com/v1.0/me';

        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (response.ok) {
            const data = await response.json();

            // Check if surname is present in the data
            if (data && data.surname) {
                // Check if the surname is between the given values
                const surname = data.surname;
                const minSurnameLower = 210103001;
                const maxSurnameLower = 210103140;
                if (surname >= minSurnameLower && surname <= maxSurnameLower) {
                    next();
                } else {
                    res.status(409).json({ msg: 'Surname out of range' });
                }
            } else {
                res.status(409).json({ msg: 'Surname not found in user data' });
            }
        } else {
            res.status(410).json({ msg: 'User not registered' });
        }
    } catch (error) {
        res.status(500).json({ msg: 'Internal Server Error' });
    }
}


export default checkStudent;