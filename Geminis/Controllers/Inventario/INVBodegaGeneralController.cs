using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Geminis.Models;
using Newtonsoft.Json;
using Geminis.Clases;

namespace Geminis.Controllers.Inventario
{
    public class INVBodegaGeneralController : Controller
    {
        // GET: INVBodegaGeneral
        readonly Restaurante_BDEntities bd = new Restaurante_BDEntities();
        [SessionExpireFilter]
        public ActionResult Index()
        {
            return View();
        }


        // llenar select unidad_medida
        public JsonResult ObtenerBodegaSelect()
        {
            try
            {
                string query = "SELECT * FROM UNIDAD_MEDIDA WHERE ESTADO='A'";
                var lista = bd.Database.SqlQuery<UNIDAD_MEDIDA>(query).ToList();
                return Json(new { ESTADO = 1, DATA = lista }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { ESTADO = -1, Mensaje = ex.Message.ToString() }, JsonRequestBehavior.AllowGet);

            }
        }
        //GUARDAR BODEGA GENERAL
        [SessionExpireFilter]
        public JsonResult Guardar(string datos)
        {
            using (var transaccion = bd.Database.BeginTransaction())
            {
                try
                {
                    var obtenerDatos = JsonConvert.DeserializeObject<INVENTARIO_BODEGA_GENERAL>(datos);
                    obtenerDatos.ESTADO = "A";
                    obtenerDatos.FECHA_INGRESO = DateTime.Now;
                    obtenerDatos.SUBTOTAL = obtenerDatos.CANTIDAD * obtenerDatos.PRECIO;
                    obtenerDatos.CREADO_POR = Session["usuario"].ToString();
                    bd.INVENTARIO_BODEGA_GENERAL.Add(obtenerDatos);
                    bd.SaveChanges();
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
        // INGRESO DE PRODUCTO
        public JsonResult Agregar(string datos)
        {
            using (var transaccion = bd.Database.BeginTransaction())
            {
                try
                {
                    var obtenerDatos = JsonConvert.DeserializeObject<INVENTARIO_BODEGA_GENERAL>(datos);
                    //string query = "SELECT * FROM INVENTARIO_BODEGA_GENERAL WHERE ID_BODEGA_GENERAL = " + obtenerDatos.ID_BODEGA_GENERAL;
                    //var editarDatos = bd.Database.SqlQuery<INVENTARIO_BODEGA_GENERAL>(query).SingleOrDefault();
                    //editarDatos.CANTIDAD += obtenerDatos.CANTIDAD;
                    //editarDatos.SUBTOTAL = Convert.ToDecimal(obtenerDatos.CANTIDAD) * Convert.ToDecimal(obtenerDatos.PRECIO);
                    //bd.Entry(editarDatos).State = EntityState.Modified;
                    //bd.SaveChanges();
                    string vquery = @"UPDATE INVENTARIO_BODEGA_GENERAL
                                    SET CANTIDAD= " + obtenerDatos.CANTIDAD + @",
                                    SUBTOTAL=" + obtenerDatos.SUBTOTAL + @"
                                    WHERE ID_BODEGA_GENERAL=" + obtenerDatos.ID_BODEGA_GENERAL;
                    bd.Database.ExecuteSqlCommand(vquery);
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

        // EGRESO DE PRODUCTO
        [SessionExpireFilter]
        public JsonResult Extraer(string datos)
        {
            using (var transaccion = bd.Database.BeginTransaction())
            {
                try
                {

                    var obtenerDatos = JsonConvert.DeserializeObject<INVENTARIO_BODEGA_GENERAL>(datos);
                    string query = "SELECT * FROM INVENTARIO_BODEGA_GENERAL WHERE ID_BODEGA_GENERAL=" + obtenerDatos.ID_BODEGA_GENERAL;
                    var editarDatos = bd.Database.SqlQuery<INVENTARIO_BODEGA_GENERAL>(query).SingleOrDefault();
                    decimal cantidad2 = (decimal)editarDatos.CANTIDAD - (decimal)obtenerDatos.CANTIDAD;
                    editarDatos.CANTIDAD = cantidad2;
                    editarDatos.SUBTOTAL = editarDatos.PRECIO * cantidad2;
                    bd.Entry(editarDatos).State = EntityState.Modified;
                    //codigo para insertar a tabla BITACORA_COCINA
                    string query2 = "INSERT INTO BITACORA_COCINA(CANTIDAD,FECHA_SALIDA,USUARIO,ID_BODEGA_GENERAL)  VALUES(" + obtenerDatos.CANTIDAD + ",GETDATE(), '" + Session["usuario"].ToString() + "'," + obtenerDatos.ID_BODEGA_GENERAL + ")";
                    bd.Database.ExecuteSqlCommand(query2);
                    // codigo que permite hacer la actualización o inserción a la tabla inventario cocina
                    string query3 = "SELECT * FROM INVENTARIO_COCINA WHERE ID_BODEGA_GENERAL=" + obtenerDatos.ID_BODEGA_GENERAL;
                    var DatosCocina = bd.Database.SqlQuery<INVENTARIO_COCINA>(query3).SingleOrDefault();
                    var id_Cocina = (from id in bd.INVENTARIO_COCINA

                                     select id.ID_BODEGA_GENERAL).ToList();
                    var bandera = true;
                    for (int i = 0; i < id_Cocina.Count; i++)
                    {
                        if (id_Cocina[i] == obtenerDatos.ID_BODEGA_GENERAL)
                        {
                            string query5=  "UPDATE INVENTARIO_COCINA SET CANTIDAD_NETA ="+ (DatosCocina.CANTIDAD_NETA + obtenerDatos.CANTIDAD) + ",SUBTOTAL ="+((DatosCocina.CANTIDAD_NETA+obtenerDatos.CANTIDAD)*obtenerDatos.PRECIO) +" WHERE ID_BODEGA_GENERAL ="+obtenerDatos.ID_BODEGA_GENERAL;
                            bd.Database.ExecuteSqlCommand(query5);
                            bandera = false;
                        }


                    }
                    if (bandera)
                    {
                        string query4 = "INSERT INTO INVENTARIO_COCINA(NOMBRE, CANTIDAD_NETA, FECHA_INGRESO,PRECIO, SUBTOTAL, CANTIDAD_CONVERSION, ID_UNIDAD_MEDIDA,ID_BODEGA_GENERAL)VALUES('" + obtenerDatos.NOMBRE_PRODUCTO + "'," + obtenerDatos.CANTIDAD + ",GETDATE(), " + obtenerDatos.PRECIO + ", " + obtenerDatos.CANTIDAD * obtenerDatos.PRECIO + ", 0, " + editarDatos.ID_UNIDAD_MEDIDA + ", " + obtenerDatos.ID_BODEGA_GENERAL + ")";
                        bd.Database.ExecuteSqlCommand(query4);
                    }
                    bd.SaveChanges();
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
        //EDITAR TABLA
        public JsonResult Editar(string datos)
        {
            using (var transaccion = bd.Database.BeginTransaction())
            {
                try
                {
                    var obtenerDatos = JsonConvert.DeserializeObject<INVENTARIO_BODEGA_GENERAL>(datos);
                    string query = "SELECT * FROM INVENTARIO_BODEGA_GENERAL WHERE ID_BODEGA_GENERAL = " + obtenerDatos.ID_BODEGA_GENERAL;
                    var editarTabla = bd.Database.SqlQuery<INVENTARIO_BODEGA_GENERAL>(query).SingleOrDefault();
                    editarTabla.NOMBRE_PRODUCTO = obtenerDatos.NOMBRE_PRODUCTO;
                    editarTabla.DESCRIPCION = obtenerDatos.DESCRIPCION;
                    editarTabla.CANTIDAD = obtenerDatos.CANTIDAD;
                    editarTabla.FECHA_INGRESO = DateTime.Now;
                    editarTabla.PRECIO = obtenerDatos.PRECIO;
                    editarTabla.ID_UNIDAD_MEDIDA = obtenerDatos.ID_UNIDAD_MEDIDA;
                    editarTabla.SUBTOTAL = obtenerDatos.CANTIDAD * obtenerDatos.PRECIO;
                    bd.Entry(editarTabla).State = EntityState.Modified;
                    // codigo que permite hacer la actualización a la tabla cocina
                    string query3 = "SELECT * FROM INVENTARIO_COCINA WHERE ID_BODEGA_GENERAL=" + obtenerDatos.ID_BODEGA_GENERAL;
                    var DatosCocina = bd.Database.SqlQuery<INVENTARIO_COCINA>(query3).SingleOrDefault();
                    var id_Cocina = (from id in bd.INVENTARIO_COCINA

                                     select id.ID_BODEGA_GENERAL).ToList();
                    for (int i = 0; i < id_Cocina.Count; i++)
                    {
                        if (id_Cocina[i] == obtenerDatos.ID_BODEGA_GENERAL)
                        {
                            string query5 = "UPDATE INVENTARIO_COCINA SET PRECIO =" + obtenerDatos.PRECIO + ",SUBTOTAL =" + (DatosCocina.CANTIDAD_NETA * obtenerDatos.PRECIO) + " WHERE ID_BODEGA_GENERAL =" + obtenerDatos.ID_BODEGA_GENERAL;
                            bd.Database.ExecuteSqlCommand(query5);
                            i = id_Cocina.Count();
                        }


                    }
                    bd.SaveChanges();
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

        //ELIMINAR
        public JsonResult Eliminar(string id)
        {
            using (var transaccion = bd.Database.BeginTransaction())
            {
                try
                {
                    string query = "SELECT * FROM INVENTARIO_BODEGA_GENERAL WHERE ID_BODEGA_GENERAL=" + id;
                    var editarTabla = bd.Database.SqlQuery<INVENTARIO_BODEGA_GENERAL>(query).SingleOrDefault();
                    editarTabla.ESTADO = "I";
                    bd.Entry(editarTabla).State = EntityState.Modified;
                    bd.SaveChanges();
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

        // funcion de cargar datos
        public JsonResult CargarTablaInventarioGeneral()
        {

            try
            {
                string query = @"SELECT 
                                A.ID_BODEGA_GENERAL,
                                A.NOMBRE_PRODUCTO,
                                B.ID_UNIDAD_MEDIDA,
                                B.DESCRIPCION AS UNIDADMEDIDA,
                                A.DESCRIPCION, ISNULL(A.CANTIDAD,0) AS CANTIDAD, 
                                CONVERT(VARCHAR(20), A.FECHA_INGRESO) AS FECHA_INGRESO, 
                                ISNULL(A.PRECIO,0) AS PRECIO, ISNULL(A.SUBTOTAL,0) AS SUBTOTAL, A.CREADO_POR, A.ESTADO
                                FROM INVENTARIO_BODEGA_GENERAL A
                                INNER JOIN UNIDAD_MEDIDA B ON
                                A.ID_UNIDAD_MEDIDA=B.ID_UNIDAD_MEDIDA";
                var lista = bd.Database.SqlQuery<TABLA_INVENTARIO_GENERAL_>(query).ToList();
                return Json(new { Estado = 1, data = lista }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {

                return Json(new { Estado = -1, Mensaje = ex.Message.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        public class TABLA_INVENTARIO_GENERAL_
        {
            public int? ID_BODEGA_GENERAL { get; set; }
            public string NOMBRE_PRODUCTO { get; set; }
            public int? ID_UNIDAD_MEDIDA { get; set; }
            public string UNIDADMEDIDA { get; set; }
            public string DESCRIPCION { get; set; }
            public decimal? CANTIDAD { get; set; }
            public string FECHA_INGRESO { get; set; }
            public decimal? PRECIO { get; set; }
            public decimal? SUBTOTAL { get; set; }
            public string CREADO_POR { get; set; }
            public string ESTADO { get; set; }

        }
    }
}