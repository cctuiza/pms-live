﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace PMS.Models
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class COREDBEntities : DbContext
    {
        public COREDBEntities()
            : base("name=COREDBEntities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<pms_indicators> pms_indicators { get; set; }
        public virtual DbSet<pms_mainkpi> pms_mainkpi { get; set; }
        public virtual DbSet<pms_subkpi> pms_subkpi { get; set; }
        public virtual DbSet<pms_subkpiperformancerate> pms_subkpiperformancerate { get; set; }
        public virtual DbSet<pms_useraccess> pms_useraccess { get; set; }
    }
}
