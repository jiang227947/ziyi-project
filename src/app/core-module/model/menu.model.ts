/**
 * 菜单模型
 */
export class MenuModel {
  /**
   * 菜单id
   */
  public menuId: string;
  /**
   * 父级菜单id
   */
  parentMenuId?: string;
  /**
   * 子菜单集合
   */
  children: MenuModel[];
  /**
   * 菜单名称
   */
  public menuName: string;
  /**
   * 菜单级别
   */
  public menuLevel: number;
  /**
   * 菜单跳转路径
   */
  public menuHref: string;
  /**
   * 图片路径
   */
  public imageUrl: string;
  /**
   * icon路径
   */
  public icon?: string;
  /**
   * 菜单排序
   */
  public menuSort?: number;
  /**
   * 菜单是否显示
   */
  public isShow: boolean;
  /**
   * 菜单模板id
   */
  public menuTemplateId?: string;
  /**
   * 菜单是否选中
   */
  public isSelected: boolean;
  /**
   * 菜单是否展开
   */
  public expand?: boolean;
}
