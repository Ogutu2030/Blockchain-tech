// Example login function update
async function handleLogin(e) {
    e.preventDefault();
    
    try {
        const response = await fetch('/api/v1/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': getCookie('XSRF-TOKEN')
            },
            body: JSON.stringify({
                national_id: formValues.nationalId,
                password: formValues.password
            }),
            credentials: 'include'
            
        });

        const data = await response.json();
        
        if (response.ok) {
            user = data.user;
            loggedIn = true;
            updateNavbar();
            setPage('dashboard');
        } else {
            alert(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred during login');
    }
}

// Helper function to get cookies
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
pool.getConnection()
    .then(conn => {
        console.log('Database connected successfully');
        conn.release();
    })
    .catch(err => {
        console.error('Database connection failed:', err);
    });