const validate = {
    // Email validation
    isValidEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Password validation (minimum 6 characters)
    isValidPassword: (password) => {
        return password && password.length >= 6;
    },

    // Note validation
    validateNote: (req, res, next) => {
        const { title, content } = req.body;
        
        if (!title || title.trim().length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Title is required.' 
            });
        }

        if (!content || content.trim().length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Content is required.' 
            });
        }

        next();
    },

    // User registration validation
    validateRegister: (req, res, next) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email and password are required.' 
            });
        }

        if (!validate.isValidEmail(email)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide a valid email address.' 
            });
        }

        if (!validate.isValidPassword(password)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Password must be at least 6 characters long.' 
            });
        }

        next();
    }
};

module.exports = validate;