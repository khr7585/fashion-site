const express=require("express");
const router=express.Router();
const{
    addproduct,
    getproducts,
    getproductbyid,
    updateproduct,
    deleteproduct,
}=require("../controllers/productcontroller");
router.post("/",addproduct);
router.get("/",getproducts);
router.get("/:id",getproductbyid);
router.put("/:id",updateproduct);
router.delete("/:id",deleteproduct);
module.exports=router;