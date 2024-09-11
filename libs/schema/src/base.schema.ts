import { isArray, pickBy } from 'lodash';
import { HydratedDocument, Types } from 'mongoose';

/**
 * READ MORE:
 * - https://github.com/nestjs/mongoose/issues/408#issuecomment-741491739
 * - https://stackoverflow.com/questions/74192597/extend-document-class-or-document-with-mongoose-schemas
 */

export interface BaseInterface {
  id?: string;

  _id?: string;

  createdAt?: Date;

  updatedAt?: Date;
}

export class BaseSchema<T = BaseInterface> implements HydratedDocument<any> {
  id?: string;

  _id?: Types.ObjectId;

  constructor(doc: any) {
    Object.assign(this, doc);
    if (!this.id && this._id) this.id = `${this._id}`;
  }

  /**
   * drop undefined, null, empty array
   */

  static lean(value: any) {
    return isArray(value)
      ? value.length > 0
      : typeof value !== 'function' &&
          value !== undefined &&
          value !== null &&
          value !== '';
  }

  /**
   * return object can stringify base on interface
   */
  toObject?: any;

  /**
   * instance of GraphQL ObjectTyoe
   */
  toEntity(): T | T[] {
    const value = typeof this?.toObject === 'function' ? this.toObject() : this;
    if (!value.id && this._id) value.id = `${value._id}`;
    return pickBy(value, BaseSchema.lean) as T | T[];
  }

  stringify() {
    const lean = this.toEntity();
    return JSON.stringify(lean);
  }
}
