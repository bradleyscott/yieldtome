using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using yieldtome.Interfaces;

namespace yieldtome.API.Tests
{
    [TestClass]
    public class APIKeyServiceTests
    {
        IAPIKeyService _service;
        
        [TestInitialize()]
        public void Initialize()
        {
            if (!Extensibility.IsContainerRunning)
                Extensibility.StartContainer();

            _service = Extensibility.Container.GetExportedValue<IAPIKeyService>();
        }

        [TestMethod]
        public void Validate_MissingKey()
        {
            string key = "";
            Assert.IsFalse(_service.Validate(key));
        }

        [TestMethod]
        public void Validate_InvalidKey()
        {
            string key = "blah";
            Assert.IsFalse(_service.Validate(key));
        }

        [TestMethod]
        public void Validate_Success()
        {
            string key = "4F35393A-C972-4D87-8F53-77EC2AD43414";
            Assert.IsTrue(_service.Validate(key));
        }
    }
}