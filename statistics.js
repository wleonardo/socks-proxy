module.exports = {
  /**
   * [hasProperty 判断本身是否有某个属性]
   * @param  {[type]}  propertyName [属性名]
   * @return {Boolean}              [是否有该属性]
   */
  hasProperty(propertyName) {
    return this[propertyName] != undefined && this[propertyName] != null;
  },
  /**
   * [add 用于增加属性的值]
   * @param {[type]} propertyName [属性名]
   */
  add(propertyName) {
    propertyName = `_${propertyName}`;
    this.hasProperty(propertyName) && this[propertyName]++;
  },
  /**
   * [reduce 用于减少属性值]
   * @param  {[type]} propertyName [属性名]
   */
  reduce(propertyName) {
    propertyName = `_${propertyName}`;
    this.hasProperty(propertyName) && this[propertyName]--;
  },
  /**
   * [_totalSocketNumber 接入socket的总数量]
   * @type {Number}
   */
  _totalSocketNumber: 0,
  /**
   * [totalSocketNumber 获取接入socket的总数量]
   * @return {[type]} [接入socket的总数量]
   */
  get totalSocketNumber() {
    return this._totalSocketNumber;
  },
  /**
   * [_handleSocketNumber 触发close事件的socket的数量]
   * @type {Number}
   */
  _handleSocketNumber: 0,
  get handleSocketNumber() {
    return this._handleSocketNumber;
  },
  /**
   * [_socketNumber 当前连接的socket数量]
   * @type {Number}
   */
  _socketNumber: 0,
  get socketNumber() {
    return this._socketNumber;
  },
  /**
   * [_errorSocketNumber 错误socket的数量]
   * @type {Number}
   */
  _errorSocketNumber: 0,
  get errorSocketNumber() {
    return this._errorSocketNumber;
  }
};
