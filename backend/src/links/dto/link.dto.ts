import { LinkType } from '../enums/link-type.enum';

export class LinkDto {
  id: string;
  type: LinkType;
  ref: string;

  constructor(id: string, type: LinkType, ref: string) {
    this.id = id;
    this.type = type;
    this.ref = ref;
  }
}
