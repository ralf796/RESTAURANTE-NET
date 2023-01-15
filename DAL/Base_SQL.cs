using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using BE;

namespace DAL
{
    internal class Base_SQL:IDisposable
    {
        SqlConnection Connection;
        public SqlCommand Command;
        SqlDataAdapter Adapter;
        DataSet Data;

        public void Dispose()
        {
            if (Connection != null)
                if (Connection.State == ConnectionState.Open)
                {
                    Connection.Close();
                    Connection.Dispose();
                    Connection = null;
                }
            if (Command != null)
                Command = null;
            if (Adapter != null)
                Adapter = null;
            if (Data != null)
                Data = null;
        }

        public Base_SQL(string sp, CommandType type = CommandType.StoredProcedure)
        {
            //Conexion
            Connection = new SqlConnection(System.Configuration.ConfigurationManager.ConnectionStrings["SQL_Restaurante"].ConnectionString);
            Connection.Open();
            //Command
            Command = new SqlCommand(sp, Connection);
            Command.CommandType = type;
            //Adapter
            Adapter = new SqlDataAdapter(Command);
            //DataSet
            Data = new DataSet();
        }

        public List<T> GetData<T>()
        {
            List<T> objects = null;
            try
            {
                //Fill Data
                Adapter.Fill(Data);

                //Process data
                if (Data.Tables.Count > 0)
                {
                    objects = new List<T>();
                    DataColumnCollection Columns = Data.Tables[0].Columns;
                    PropertyInfo[] properties = typeof(T).GetProperties(BindingFlags.DeclaredOnly | BindingFlags.Public | BindingFlags.Instance);
                    foreach (DataRow dataRow in Data.Tables[0].Rows)
                    {
                        T obj = Activator.CreateInstance<T>();
                        try
                        {
                            foreach (var property in properties)
                            {
                                try
                                {
                                    if (Columns.Contains(property.Name))
                                    {
                                        object propertyValue = dataRow[property.Name];
                                        if (propertyValue == DBNull.Value && property.PropertyType is Object)
                                        {
                                            property.SetValue(obj, null, new object[] { });
                                        }
                                        else if (propertyValue != DBNull.Value)
                                        {
                                            property.SetValue(obj, propertyValue, new object[] { });
                                        }
                                    }
                                }
                                catch
                                {
                                    // throw ex;
                                }
                            }
                            //properties = null;
                        }
                        catch
                        {
                            //throw ex;
                        }
                        objects.Add(obj);
                    }
                }
                Data.Clear();
                Data.Dispose();
                Data = null;
            }
            catch (Exception exception)
            {
                throw exception;
            }
            return objects;
        }

        public Respuesta ExecuteNonQuery()
        {
            Respuesta result = new Respuesta();
            try
            {
                //Get Result
                result.Codigo = Command.ExecuteNonQuery();
                result.Resultado = true;
            }
            catch (Exception exception)
            {
                throw exception;
            }
            return result;
        }
        public Respuesta ExecuteScalar()
        {
            Respuesta result = new Respuesta();
            try
            {
                //Get Result
                result.Codigo = Convert.ToInt32(Command.ExecuteScalar());
                result.Resultado = true;
            }
            catch (Exception exception)
            {
                throw exception;
            }
            return result;
        }
    }
}

