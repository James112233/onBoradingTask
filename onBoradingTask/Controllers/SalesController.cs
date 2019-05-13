using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using onBoradingTask.Models;
using Newtonsoft.Json;

namespace onBoradingTask.Controllers
{
    public class SalesController : Controller
    {
        SalesEntities db = new SalesEntities();

        // GET: Sales
        public ActionResult Index()
        {
            return View();
        }

        //GET: SalesList
        public JsonResult GetSalesList()
        {
            try
            {
                var salesList = db.SALES.Select(x => new 
                {
                    Id = x.ID,
                    DateSold = x.DATESOLD,
                    CustomerName = x.CUSTOMER.NAME,
                    ProductName = x.PRODUCT.NAME,
                    StoreName = x.STORE.NAME,
                }).ToList();
                var sale = Json(salesList, JsonRequestBehavior.AllowGet);
                return sale;
            }
            catch (Exception e)
            {
                Console.Write(e.Data + "Exception Occured");
                return new JsonResult { Data = "Data Not Found", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        //CREATE Sale
        public JsonResult CreateSale(SALES sale)
        {
            try
            {
                db.SALES.Add(sale);
                db.SaveChanges();
            }
            catch (Exception e)
            {
                Console.Write(e.Data + "Exception Occured");
                return new JsonResult { Data = "Sale Create Failed", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            return new JsonResult { Data = "Success", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        //GET Customers
        public JsonResult GETCustomers()
        {
            try
            {
                var customerData = db.CUSTOMER.Select(p => new { Id = p.ID, CustomerName = p.NAME }).ToList();

                return new JsonResult { Data = customerData, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                Console.Write(e.Data + "Exception Occured");
                return new JsonResult { Data = "Data Not Found", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }


        //GET Products
        public JsonResult GETProducts()
        {
            try
            {
                var productData = db.PRODUCT.Select(p => new { Id = p.ID, ProductName = p.NAME }).ToList();

                return new JsonResult { Data = productData, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                Console.Write(e.Data + "Exception Occured");
                return new JsonResult { Data = "Data Not Found", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }


        //GET Stores
        public JsonResult GETStores()
        {
            try
            {
                var storeData = db.STORE.Select(p => new { Id = p.ID, StoreName = p.NAME }).ToList();

                return new JsonResult { Data = storeData, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                Console.Write(e.Data + "Exception Occured");
                return new JsonResult { Data = "Data Not Found", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        //DELETE Sale
        public JsonResult DeleteSale(int id)
        {
            try
            {
                var sale = db.SALES.Where(s => s.ID == id).SingleOrDefault();
                if (sale != null) { 
                    db.SALES.Remove(sale);
                    db.SaveChanges();
                }
            }
            catch (Exception e)
            {
                Console.Write(e.Data + "Exception Occured");
                return new JsonResult { Data = "Sales Delete Failed", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            return new JsonResult { Data = "Success", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        //GET Update Sale
        public JsonResult GetUpdateSale(int id)
        {
            try
            {
                SALES sale = db.SALES.Where(x => x.ID == id).SingleOrDefault();
                string value = JsonConvert.SerializeObject(sale, Formatting.Indented, new JsonSerializerSettings
                {
                    ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                });
                return Json(value, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Console.Write(e.Data + "Exception Occured");
                return new JsonResult { Data = "Sale Not Found", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        //UPDATE Sale
        public JsonResult UpdateSale(SALES sale)
        {
            try
            {
                SALES sa = db.SALES.Where(s => s.ID == sale.ID).SingleOrDefault();
                sa.CUSTOMERID = sale.CUSTOMERID;
                sa.PRODUCTID = sale.PRODUCTID;
                sa.STOREID = sale.STOREID;
                sa.DATESOLD = sale.DATESOLD;

                db.SaveChanges();
            }
            catch (Exception e)
            {
                Console.Write(e.Data + "Exception Occured");
                return new JsonResult { Data = "", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            return new JsonResult { Data = "Success", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

    }
}