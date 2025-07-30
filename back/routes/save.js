
import User from '../models/User.js';

const router = express.Router();

router.post("/save",(req,res)=>{
    const {model}=req.body;
    const newModel=new User
})
export default router;
