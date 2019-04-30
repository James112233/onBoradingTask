using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using onBoradingTask.Models;
using Newtonsoft.Json;

namespace onBoradingTask.Controllers
{
    public class StoreController : Controller
    {
        SalesEntities db = new SalesEntities();
        // GET: Store
        public ActionResult Index()
        {
            return View();
        }

        //GET: StoreList
        public JsonResult GetStoreList()
        {
            try
            {
                var storeList = db.STORE.Select(x => new StoreModel
                {
                    StoreId = x.ID,
                    StoreName = x.NAME,
                    StoreAddress = x.ADDRESS,
                }).ToList();

                return Json(storeList, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Console.Write(e.Data + "Exception Occured");
                return new JsonResult { Data = "Data Not Found", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        //CREATE Store
        public JsonResult CreateStore(STORE store)
        {
            try
            {
                db.STORE.Add(store);
                db.SaveChanges();
            }
            catch (Exception e)
            {
                Console.Write(e.Data + "Exception Occured");
                return new JsonResult { Data = "Store Create Failed", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            return new JsonResult { Data = "Success", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        //DELETE Store
        public JsonResult DeleteStore(int id)
        {
            try
            {
                var store = db.STORE.Where(p => p.ID == id).SingleOrDefault();
                if (store != null)
                {
                    db.STORE.Remove(store);
                    db.SaveChanges();
                }
            }
            catch (Exception e)
            {
                Console.Write(e.Data + "Exception Occured");
                return new JsonResult { Data = "Store Delete Failed", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            return new JsonResult { Data = "Success", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        //GET Update Store
        public JsonResult GetUpdateStore(int id)
        {
            try
            {
                STORE store = db.STORE.Where(x => x.ID == id).SingleOrDefault();
                string value = JsonConvert.SerializeObject(store, Formatting.Indented, new JsonSerializerSettings
                {
                    ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                });
                return Json(value, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Console.Write(e.Data + "Exception Occured");
                return new JsonResult { Data = "Store Not Found", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        //UPDATE Store
        public JsonResult UpdateStore(STORE store)
        {
            try
            {
                STORE sto = db.STORE.Where(p => p.ID == store.ID).SingleOrDefault();
                sto.NAME = store.NAME;
                sto.ADDRESS = store.ADDRESS;
                db.SaveChanges();
            }
            catch (Exception e)
            {
                Console.Write(e.Data + "Exception Occured");
                return new JsonResult { Data = "Store Update Failed", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            return new JsonResult { Data = "Success", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

    }
}