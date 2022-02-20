using Geminis.Clases;
using Geminis.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Geminis.Controllers.Inventario
{
    public class INVBodegaController : Controller
    {
        readonly Restaurante_BDEntities db = new Restaurante_BDEntities();
        // GET: INVBodega
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// GUARDAR EN TABLA EMPLEADO
        /// </summary>
        /// <param name="datos"> DEVUELVE EL JSON DESDE EL JS</param>
        /// <returns></returns>
        [SessionExpireFilter]
        public JsonResult Guardar(string datos)
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    var obtenerDatos = JsonConvert.DeserializeObject<INVENTARIO_BODEGA_GENERAL>(datos);
                    //obtenerDatos.EXISTENCIA = 1;
                    obtenerDatos.FECHA_INGRESO = DateTime.Now;
                    //obtenerDatos.INGRESADO_POR = Session["usuario"].ToString();
                    db.INVENTARIO_BODEGA_GENERAL.Add(obtenerDatos);
                    db.SaveChanges();
                    transaccion.Commit();
                    return Json(new { Estado = 1 }, JsonRequestBehavior.AllowGet);
                }
                catch (Exception ex)
                {
                    transaccion.Rollback();
                    return Json(new { Estado = -1, Mensaje = ex.Message.ToString() }, JsonRequestBehavior.AllowGet);
                }
            }
        }

        /// <summary>
        /// EDITAR TABLA
        /// </summary>
        /// <param name="datos"></param>
        /// <returns></returns>
        public JsonResult Agregar(string datos)
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    var obtenerDatos = JsonConvert.DeserializeObject<INVENTARIO_BODEGA_GENERAL>(datos);

                    string query = "SELECT * FROM INVENTARIO_BODEGA_GENERAL WHERE ID_BODEGA_GENERAL = " + obtenerDatos.ID_BODEGA_GENERAL;
                    var editarTabla = db.Database.SqlQuery<INVENTARIO_BODEGA_GENERAL>(query).SingleOrDefault();
                    
                    editarTabla.NOMBRE_PRODUCTO = obtenerDatos.NOMBRE_PRODUCTO;
                    editarTabla.CANTIDAD += obtenerDatos.CANTIDAD;
                    //editarTabla.EXISTENCIA = 1;
                    db.Entry(editarTabla).State = EntityState.Modified;
                    db.SaveChanges();
                    transaccion.Commit();
                    return Json(new { Estado = 1 }, JsonRequestBehavior.AllowGet);
                }
                catch (Exception ex)
                {
                    transaccion.Rollback();
                    return Json(new { Estado = -1, Mensaje = ex.Message.ToString() }, JsonRequestBehavior.AllowGet);
                }
            }
        }

        public JsonResult Quitar(string datos)
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    var obtenerDatos = JsonConvert.DeserializeObject<INVENTARIO_BODEGA_GENERAL>(datos);

                    string query = "SELECT * FROM INVENTARIO_BODEGA_GENERAL WHERE ID_BODEGA_GENERAL = " + obtenerDatos.ID_BODEGA_GENERAL;
                    var editarTabla = db.Database.SqlQuery<INVENTARIO_BODEGA_GENERAL>(query).SingleOrDefault();

                    
                    if (obtenerDatos.CANTIDAD < editarTabla.CANTIDAD)
                    {
                        editarTabla.NOMBRE_PRODUCTO = obtenerDatos.NOMBRE_PRODUCTO;
                        editarTabla.CANTIDAD -=obtenerDatos.CANTIDAD;
                        //editarTabla.FECHA_SALIDA = DateTime.Now;
                        db.Entry(editarTabla).State = EntityState.Modified;
                        db.SaveChanges();
                        transaccion.Commit();
                        return Json(new { Estado = 1 }, JsonRequestBehavior.AllowGet);
                    }
                    else if (obtenerDatos.CANTIDAD == editarTabla.CANTIDAD)
                    {
                        editarTabla.NOMBRE_PRODUCTO = obtenerDatos.NOMBRE_PRODUCTO;
                        editarTabla.CANTIDAD = editarTabla.CANTIDAD - obtenerDatos.CANTIDAD;
                        //editarTabla.FECHA_SALIDA = DateTime.Now;
                        //editarTabla.EXISTENCIA = 0;
                        db.Entry(editarTabla).State = EntityState.Modified;
                        db.SaveChanges();
                        transaccion.Commit();
                        return Json(new { Estado = 1 }, JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        transaccion.Commit();
                        return Json(new { Estado = 0 }, JsonRequestBehavior.AllowGet);
                    }
                    

                }
                catch (Exception ex)
                {
                    transaccion.Rollback();
                    return Json(new { Estado = -1, Mensaje = ex.Message.ToString() }, JsonRequestBehavior.AllowGet);
                }
            }
        }
                
        public JsonResult CargarTablaBodega()
        {
            try
            {
                string query = @"SELECT ID_BODEGA_GENERAL, 
                                NOMBRE_PRODUCTO, 
                                CONVERT(VARCHAR(20),CANTIDAD) AS CANTIDAD, 
                                CONVERT(VARCHAR(20),FECHA_INGRESO) AS FECHA_INGRESO,
                                CONVERT(VARCHAR(20),FECHA_SALIDA) AS FECHA_SALIDA,
                                INGRESADO_POR,
                                CONVERT(VARCHAR(20),PRECIO) AS PRECIO,
                                DESCRIPCION,
                                CONVERT(VARCHAR(20),EXISTENCIA) AS EXISTENCIA
                                FROM INVENTARIO_BODEGA_GENERAL";
                var lista = db.Database.SqlQuery<TABLA_BODEGA_>(query).ToList();
                return Json(new { ESTADO = 1, data = lista }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Estado = -1, Mensaje = ex.Message.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        public class TABLA_BODEGA_
        {
            public int? ID_BODEGA_GENERAL { set; get; }
            public string NOMBRE_PRODUCTO { set; get; }
            public string CANTIDAD { set; get; }
            public string FECHA_INGRESO { set; get; }
            public string FECHA_SALIDA { set; get; }
            public string INGRESADO_POR { set; get; }
            public string PRECIO { set; get; }
            public string DESCRIPCION { set; get; }
            public string EXISTENCIA { set; get; }
        }
    }
}