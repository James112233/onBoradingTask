using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using onBoradingTask.Models;
using Newtonsoft.Json;

namespace onBoradingTask.Controllers
{
    public class ProductController : Controller
    {
        SalesEntities db = new SalesEntities();

        // GET: Product
        public ActionResult Index()
        {
            return View();
        }

        //GET: ProductList
        public JsonResult GetProductList()
        {
            try
            {
                var productList = db.PRODUCT.Select(x => new ProductModel
                {
                    Id = x.ID,
                    Name = x.NAME,
                    Price = x.PRICE,
                }).ToList();

                return Json(productList, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Console.Write(e.Data + "Exception Occured");
                return new JsonResult { Data = "Data Not Found", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        //CREATE Product
        public JsonResult CreateProduct(PRODUCT product)
        {
            try
            {
                db.PRODUCT.Add(product);
                db.SaveChanges();
            }
            catch (Exception e)
            {
                Console.Write(e.Data + "Exception Occured");
                return new JsonResult { Data = "Product Create Failed", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            return new JsonResult { Data = "Success", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        //DELETE Product
        public JsonResult DeleteProduct(int id)
        {
            try
            {
                var product = db.PRODUCT.Where(p => p.ID == id).SingleOrDefault();
                if(product != null)
                {
                    db.PRODUCT.Remove(product);
                    db.SaveChanges();
                }
            }
            catch (Exception e)
            {
                Console.Write(e.Data + "Exception Occured");
                return new JsonResult { Data = "Product Delete Failed", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            return new JsonResult { Data = "Success", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        //GET Update Product
        public JsonResult GetUpdateProduct(int id)
        {
            try
            {
                PRODUCT product = db.PRODUCT.Where(x => x.ID == id).SingleOrDefault();
                string value = JsonConvert.SerializeObject(product, Formatting.Indented, new JsonSerializerSettings
                {
                    ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                });
                return Json(value, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Console.Write(e.Data + "Exception Occured");
                return new JsonResult { Data = "Product Not Found", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        //UPDATE Product
        public JsonResult UpdateProduct(PRODUCT product)
        {
            try
            {
                PRODUCT prod = db.PRODUCT.Where(p => p.ID == product.ID).SingleOrDefault();
                prod.NAME = product.NAME;
                prod.PRICE = product.PRICE;
                db.SaveChanges();
            }
            catch (Exception e)
            {
                Console.Write(e.Data + "Exception Occured");
                return new JsonResult { Data = "Product Update Failed", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            return new JsonResult { Data = "Success", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

    }
}