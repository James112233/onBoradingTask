//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace onBoradingTask.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class SALES
    {
        public int ID { get; set; }
        public Nullable<int> PRODUCTID { get; set; }
        public Nullable<int> CUSTOMERID { get; set; }
        public Nullable<int> STOREID { get; set; }
        public Nullable<System.DateTime> DATESOLD { get; set; }
    
        public virtual CUSTOMER CUSTOMER { get; set; }
        public virtual PRODUCT PRODUCT { get; set; }
        public virtual STORE STORE { get; set; }
    }
}