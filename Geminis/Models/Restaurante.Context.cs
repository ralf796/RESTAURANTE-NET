﻿//------------------------------------------------------------------------------
// <auto-generated>
//     Este código se generó a partir de una plantilla.
//
//     Los cambios manuales en este archivo pueden causar un comportamiento inesperado de la aplicación.
//     Los cambios manuales en este archivo se sobrescribirán si se regenera el código.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Geminis.Models
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class Restaurante_BDEntities : DbContext
    {
        public Restaurante_BDEntities()
            : base("name=Restaurante_BDEntities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<BANCO> BANCO { get; set; }
        public virtual DbSet<BITACORA_COCINA> BITACORA_COCINA { get; set; }
        public virtual DbSet<CAJA> CAJA { get; set; }
        public virtual DbSet<CLIENTE> CLIENTE { get; set; }
        public virtual DbSet<CLIENTE_DATOS_ADICIONALES> CLIENTE_DATOS_ADICIONALES { get; set; }
        public virtual DbSet<COBRO> COBRO { get; set; }
        public virtual DbSet<COBRO_DETALLE> COBRO_DETALLE { get; set; }
        public virtual DbSet<CORTE> CORTE { get; set; }
        public virtual DbSet<EMPLEADO> EMPLEADO { get; set; }
        public virtual DbSet<ESTADO_PEDIDO> ESTADO_PEDIDO { get; set; }
        public virtual DbSet<FACTURA_DETALLE> FACTURA_DETALLE { get; set; }
        public virtual DbSet<FACTURA_ENCABEZADO> FACTURA_ENCABEZADO { get; set; }
        public virtual DbSet<INVENTARIO_BODEGA_GENERAL> INVENTARIO_BODEGA_GENERAL { get; set; }
        public virtual DbSet<INVENTARIO_COCINA> INVENTARIO_COCINA { get; set; }
        public virtual DbSet<MENU> MENU { get; set; }
        public virtual DbSet<MENU_DETALLE> MENU_DETALLE { get; set; }
        public virtual DbSet<MESA> MESA { get; set; }
        public virtual DbSet<MODULO> MODULO { get; set; }
        public virtual DbSet<PAGO_MESA> PAGO_MESA { get; set; }
        public virtual DbSet<PAGO_PROVEEDOR> PAGO_PROVEEDOR { get; set; }
        public virtual DbSet<PANTALLA> PANTALLA { get; set; }
        public virtual DbSet<PEDIDO> PEDIDO { get; set; }
        public virtual DbSet<PEDIDO_DETALLE> PEDIDO_DETALLE { get; set; }
        public virtual DbSet<PEDIDO_FORMA_PAGO> PEDIDO_FORMA_PAGO { get; set; }
        public virtual DbSet<PEDIDO_FORMA_PAGO_DET> PEDIDO_FORMA_PAGO_DET { get; set; }
        public virtual DbSet<PERMISO_PANTALLA> PERMISO_PANTALLA { get; set; }
        public virtual DbSet<PRODUCTO> PRODUCTO { get; set; }
        public virtual DbSet<PROVEEDOR> PROVEEDOR { get; set; }
        public virtual DbSet<ROL> ROL { get; set; }
        public virtual DbSet<TIPO_EMPLEADO> TIPO_EMPLEADO { get; set; }
        public virtual DbSet<TIPO_MENU> TIPO_MENU { get; set; }
        public virtual DbSet<TIPO_PEDIDO> TIPO_PEDIDO { get; set; }
        public virtual DbSet<TIPO_PRODUCTO> TIPO_PRODUCTO { get; set; }
        public virtual DbSet<UNIDAD_MEDIDA> UNIDAD_MEDIDA { get; set; }
        public virtual DbSet<USUARIO> USUARIO { get; set; }
        public virtual DbSet<VALES> VALES { get; set; }
    }
}
