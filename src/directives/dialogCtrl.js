import Vue from 'vue';

// v-dialogDrag: 弹窗拖拽
Vue.directive('dialogDrag', {
  bind(el, binding, vnode, oldVnode) {
    console.log(binding, vnode, oldVnode);
    const dialogHeaderEl = el.querySelector('.el-dialog__header');
    const dragDom = el.querySelector('.el-dialog');
    dialogHeaderEl.style.cursor = 'move';
    // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
    const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null);
    dialogHeaderEl.onmousedown = e => {
      // 鼠标按下，计算当前元素距离可视区的距离
      const disX = e.clientX - dialogHeaderEl.offsetLeft;
      const disY = e.clientY - dialogHeaderEl.offsetTop;
      // 获取到的值带px 正则匹配替换
      let styL, styT;
      // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
      if (sty.left.includes('%')) {
        styL = +document.body.clientWidth * (+sty.left.replace(/%/g, '') / 100);
        styT = +document.body.clientHeight * (+sty.top.replace(/%/g, '') / 100);
      } else {
        styL = +sty.left.replace(/\px/g, '');
        styT = +sty.top.replace(/\px/g, '');
      }
      document.onmousemove = function(e) {
        // 通过事件委托，计算移动的距离
        const l = e.clientX - disX;
        const t = e.clientY - disY;
        // 移动当前元素
        dragDom.style.left = `${l + styL}px`;
        dragDom.style.top = `${t + styT}px`;
        //将此时的位置传出去
        //binding.value({x:e.pageX,y:e.pageY})
      };
      document.onmouseup = function(e) {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
  }
});

// v-dialogDragWidth: 弹窗宽度拖大 拖小
Vue.directive('dialogDragWidth', {
  bind(el, binding, vnode, oldVnode) {
    // console.log(el, binding, vnode, oldVnode);
    let dialogDiv = el.querySelector('.el-dialog');
    dialogDiv.style.position = 'relative';
    dialogDiv.insertAdjacentHTML(
      'beforeend',
      '<div class="oDiv" style="position:absolute;bottom:0;right:0;"><span class="iconfont icon-iconset0443"></span></div>'
    );
    let oDiv = dialogDiv.querySelector('.oDiv');
    oDiv.style.cursor = 'nw-resize';
    let mouseStart = {};
    let divStart = {};
    oDiv.onmousedown = ev => {
      mouseStart.x = ev.clientX;
      mouseStart.y = ev.clientY;
      divStart.x = oDiv.offsetLeft;
      divStart.y = oDiv.offsetTop;
      if (oDiv.setCapture) {
        oDiv.onmousemove = doDrag;
        oDiv.onmouseup = stopDrag;
        oDiv.setCapture();
      } else {
        document.addEventListener('mousemove', doDrag, true);
        document.addEventListener('mouseup', stopDrag, true);
      }
    };
    function doDrag(ev) {
      var oEvent = ev || event;
      var l = oEvent.clientX - mouseStart.x + divStart.x;
      var t = oEvent.clientY - mouseStart.y + divStart.y;
      var w = l + oDiv.offsetWidth;
      var h = t + oDiv.offsetHeight;
      if (w < oDiv.offsetWidth) {
        w = oDiv.offsetWidth;
      } else if (
        w >
        document.documentElement.clientWidth - dialogDiv.offsetLeft
      ) {
        w = document.documentElement.clientWidth - dialogDiv.offsetLeft - 2;
      }
      if (h < oDiv.offsetHeight) {
        h = oDiv.offsetHeight;
      } else if (
        h >
        document.documentElement.clientHeight - dialogDiv.offsetTop
      ) {
        h = document.documentElement.clientHeight - dialogDiv.offsetTop - 2;
      }
      dialogDiv.style.width = w + 'px';
      dialogDiv.style.height = h + 'px';
    }
    function stopDrag() {
      if (oDiv.releaseCapture) {
        oDiv.onmousemove = null;
        oDiv.onmouseup = null;
        oDiv.releaseCapture();
      } else {
        document.removeEventListener('mousemove', doDrag, true);
        document.removeEventListener('mouseup', stopDrag, true);
      }
    }
  }
});

//双击表格行插入子表格
Vue.directive('inertChildTable', {
  bind(el, binding, vnode, oldVnode) {
    // console.log(el, binding, vnode, oldVnode);
  }
});
