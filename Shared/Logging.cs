using Microsoft.Practices.EnterpriseLibrary.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace yieldtome
{
    public class Logging
    {
        private static LogWriter _logWriter;

        public static LogWriter LogWriter 
        {
            get
            {
                if (_logWriter != null) return _logWriter;

                LogWriterFactory logWriterFactory = new LogWriterFactory();
                _logWriter = logWriterFactory.Create();
                return _logWriter;
            }
        }

    }
}
