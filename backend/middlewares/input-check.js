const z = require("zod");

// signupSchema
const signupSchema = z.object({
    username: z.string().lowercase().min(3).max(20),
    password: z.string().min(6),
    first_name: z.string().max(50),
    last_name: z.string().max(50)
});

const signinSchema = z.object({
    username: z.string().lowercase().min(3).max(20),
    password: z.string().min(6)
})

// updateInfo Schema
const updateInfoSchema = z.object({
    password : z.string().min(6).optional(),
    first_name : z.string().max(50).optional(),
    last_name : z.string().max(50).optional()
}).strict();

module.exports = {
    signupSchema, signinSchema, updateInfoSchema, 
}
