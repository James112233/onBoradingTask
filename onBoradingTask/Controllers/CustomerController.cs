using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using onBoradingTask.Models;
using Newtonsoft.Json;

namespace onBoradingTask.Controllers
{
    public class CustomerController : Controller
    {
        SalesEntities db = new SalesEntities();

        // GET: Customer
        public ActionResult Index()
        {
            return View();
        }

        //GET: CustomerList
        public JsonResult GetCustomerList()
        {
            try
            {
                var customerList = db.CUSTOMER.Select(x => new CustomerModel
                {
                    CustomerId = x.ID,
                    CustomerName = x.NAME,
                    CustomerAddress = x.ADDRESS,
                }).ToList();

                return Json(customerList, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Console.Write(e.Data + "Exception Occured");
                return new JsonResult { Data = "Data Not Found", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        //CREATE Customer
        public JsonResult CreateCustomer(CUSTOMER customer)
        {
            try
            {
                db.CUSTOMER.Add(customer);
                db.SaveChanges();
                Console.Write("Success");
            }
            catch (Exception e)
            {
                Console.Write(e.Data + "Exception Occured");
                return new JsonResult { Data = "Customer Create Failed", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            return new JsonResult { Data = "Success", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        //DELETE Customer
        public JsonResult DeleteCustomer(int id)
        {
            try
            {
                var customer = db.CUSTOMER.Where(p => p.ID == id).SingleOrDefault();
                if(customer != null)
                {
                    db.CUSTOMER.Remove(customer);
                    db.SaveChanges();
                }
            }
            catch (Exception e)
            {
                Console.Write(e.Data + "Exception Occured");
                return new JsonResult { Data = "Customer Delete Failed", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            return new JsonResult { Data = "Success", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        //GET Update Customer
        public JsonResult GetUpdateCustomer(int id)
        {
            try
            {
                CUSTOMER customer = db.CUSTOMER.Where(x => x.ID == id).SingleOrDefault();
                string value = JsonConvert.SerializeObject(customer, Formatting.Indented, new JsonSerializerSettings
                {
                    ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                });
                return Json(value, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Console.Write(e.Data + "Exception Occured");
                return new JsonResult { Data = "Customer Not Found", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        //UPDATE Customer
        public JsonResult UpdateCustomer(CUSTOMER customer)
        {
            try
            {
                CUSTOMER cust = db.CUSTOMER.Where(p => p.ID == customer.ID).SingleOrDefault();
                cust.NAME = customer.NAME;
                cust.ADDRESS = customer.ADDRESS;
                db.SaveChanges();
            }
            catch (Exception e)
            {
                Console.Write(e.Data + "Exception Occured");
                return new JsonResult { Data = "Customer Update Failed", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            return new JsonResult { Data = "Success", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }
    }
}