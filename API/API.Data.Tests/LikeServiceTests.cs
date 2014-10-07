using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using yieldtome.Interfaces;
using yieldtome.Objects;
using System.Collections.Generic;
using yieldtome.Enums;

namespace yieldtome.API.Tests
{
    [TestClass]
    public class LikeServiceTests
    {
        ILikeService _service;
        List<int> _deletions = new List<int>();

        [TestInitialize()]
        public void Initialize()
        {
            if (!Extensibility.IsContainerRunning)
                Extensibility.StartContainer();

            _service = Extensibility.Container.GetExportedValue<ILikeService>();
        }

        [TestMethod]
        public void DoesLikeExist_InvalidLikerID()
        {
            bool like = _service.DoesLikeExist(-1, 1);
            Assert.IsFalse(like);
        }

        [TestMethod]
        public void DoesLikeExist_InvalidLikedID()
        {
            bool like = _service.DoesLikeExist(1, -1);
            Assert.IsFalse(like);
        }

        [TestMethod]
        public void DoesLikeExist_NotFound()
        {
            bool like = _service.DoesLikeExist(2, 1);
            Assert.IsFalse(like);
        }

        [TestMethod]
        public void IsLikeRequited_InvalidLikerID()
        {
            bool like = _service.IsLikeRequited(-1, 1);
            Assert.IsFalse(like);
        }

        [TestMethod]
        public void IsLikeRequited_InvalidLikedID()
        {
            bool like = _service.IsLikeRequited(1, -1);
            Assert.IsFalse(like);
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void CreateLike_InvalidLikerID()
        {
            bool like = _service.CreateLike(-1, 1);
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void CreateLike_InvalidLikedID()
        {
            bool like = _service.CreateLike(1, -1);
        }

        [TestMethod]
        public void CreateLike_Success()
        {
            bool like = _service.CreateLike(2, 1);
            Assert.IsTrue(like);  
        }

        [TestMethod]
        public void DoesLikeExist_Exists()
        {
            bool like = _service.DoesLikeExist(2, 1);
            Assert.IsTrue(like);
        }

        [TestMethod]
        public void IsLikeRequited_Requited()
        {
            bool like = _service.IsLikeRequited(1, 2);
            Assert.IsTrue(like);
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void DeleteLike_InvalidLikeID()
        {
            _service.DeleteLike(-1);
        }

        [TestMethod]
        public void DeleteLike_Success()
        {
            _service.DeleteLike(2);
        }
    }
}
