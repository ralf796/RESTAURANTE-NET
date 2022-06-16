using Geminis.Clases;
using Geminis.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Geminis.Controllers.Administracion
{

    public class ADMProveedorController : Controller
    {
        readonly Restaurante_BDEntities db = new Restaurante_BDEntities();
        // GET: ADMProveedor
        public ActionResult Index()
        {
            return View();
        }

        [SessionExpireFilter]
        public JsonResult Guardar(string datos)
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    var obtenerDatos = JsonConvert.DeserializeObject<PROVEEDOR>(datos);
                    obtenerDatos.ESTADO = "A";
                    obtenerDatos.FECHA_CREACION = Utils.ObtenerFechaServidor();
                    obtenerDatos.CREADO_POR = Session["usuario"].ToString();
                    db.PROVEEDOR.Add(obtenerDatos);
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
        public JsonResult Editar(string datos)
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    var obtenerDatos = JsonConvert.DeserializeObject<PROVEEDOR>(datos);

                    string query = "SELECT * FROM PROVEEDOR WHERE ID_PROVEEDOR = " + obtenerDatos.ID_PROVEEDOR;
                    var editarTabla = db.Database.SqlQuery<PROVEEDOR>(query).SingleOrDefault();
                    editarTabla.NOMBRE = obtenerDatos.NOMBRE;
                    editarTabla.DIRECCION = obtenerDatos.DIRECCION;
                    editarTabla.TELEFONO = obtenerDatos.TELEFONO;
                    editarTabla.DIRECCION = obtenerDatos.DIRECCION;
                    editarTabla.REFERENCIA = obtenerDatos.REFERENCIA;
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

        public JsonResult Eliminar(string id)
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    string query = "SELECT * FROM PROVEEDOR WHERE ID_PROVEEDOR = " + id;
                    var editarTabla = db.Database.SqlQuery<PROVEEDOR>(query).SingleOrDefault();
                    editarTabla.ESTADO = "I";
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

        public JsonResult CargarTabla()
        {
            try
            {
                string query = @"SELECT ID_PROVEEDOR,
                                       NOMBRE,
                                       REFERENCIA,
                                       TELEFONO,
                                       DIRECCION,
                                       ESTADO,
                                       CREADO_POR,
                                       CONVERT(VARCHAR(20), fecha_creacion) AS FECHA_CREACION
                                FROM   proveedor  ";
                var lista = db.Database.SqlQuery<TABLA_PROVEEDOR_>(query).ToList();
                return Json(new { ESTADO = 1, data = lista }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Estado = -1, Mensaje = ex.Message.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }


        public class TABLA_PROVEEDOR_
        {
            public int? ID_PROVEEDOR { set; get; }
            public string NOMBRE{ set; get; }
            public string REFERENCIA{ set; get; }
            public string TELEFONO{ set; get; }
            public string DIRECCION { set; get; }
            public string ESTADO{ set; get; }
            public string FECHA_CREACION { set; get; }
            public string CREADO_POR { set; get; }

        }
    }
}