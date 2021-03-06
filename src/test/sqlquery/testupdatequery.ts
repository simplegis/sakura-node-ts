// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import * as chai from "chai";

import {UpdateQuery} from "../../sqlquery/updatequery";
import {TableName, Column} from "../../base/decorator";
import {Model, SqlFlag, SqlType} from "../../base/model";


@TableName("users")
class User extends Model {
  @Column("uid", SqlType.INT, SqlFlag.PRIMARY_KEY)
  uid: number;

  @Column("username", SqlType.VARCHAR_255, SqlFlag.NOT_NULL)
  username: string;

  @Column("display_name", SqlType.VARCHAR_255, SqlFlag.NULLABLE)
  displayName: string;

  @Column("meta", SqlType.JSON, SqlFlag.NULLABLE)
  meta: any;

  @Column("created_at", SqlType.TIMESTAMP, SqlFlag.NULLABLE)
  createdAt: Date;

  @Column("updated_at", SqlType.TIMESTAMP, SqlFlag.NULLABLE)
  updatedAt: number;
}

describe("UpdateQuery", () => {
  it("UpdateQuery with one set and where", () => {
    const sql: string = new UpdateQuery().table("films").set("kind", "Dramatic").where(`kind='Drama'`).build();
    chai.expect(sql).to.equal(`UPDATE films SET kind='Dramatic' WHERE kind='Drama';`);
  });

  it("UpdateQuery table name from class", () => {
    const sql: string = new UpdateQuery().tableNameFromClass(User).set("kind", "Dramatic").where(`kind='Drama'`).build();
    chai.expect(sql).to.equal(`UPDATE users SET kind='Dramatic' WHERE kind='Drama';`);
  });

  it("更新语句添加set 过滤属性值为空的属性", () => {
    let user: User = new User();
    user.uid = 1;
    user.username = "hello";
    const sql: string = new UpdateQuery().fromModel(user).where(` uid = ${user.uid}`).build();
    chai.expect(sql).to.equal(`UPDATE users SET username='hello' WHERE  uid = 1;`);
  });

  it("更新语句 JSON类型字段添加表达式", () => {
    let user: User = new User();
    user.uid = 1;
    user.meta = {version: 1, test: "aaaa"};
    const sql: string = new UpdateQuery().fromModel(user).where(` uid = ${user.uid}`).build();
    chai.expect(sql).to.equal(`UPDATE users SET meta='{"version":1,"test":"aaaa"}'::json WHERE  uid = 1;`);
  });

  it("更新语句 TIMESTAMP类型字段 转换时间戳", () => {
    let user: User = new User();
    user.uid = 1;
    user.createdAt = new Date();
    user.updatedAt = Math.floor(new Date().getTime() / 1000);
    const sql: string = new UpdateQuery().fromModel(user).where(` uid = ${user.uid}`).build();
    chai.expect(sql).to.equal(`UPDATE users SET created_at=to_timestamp(${user.updatedAt}),updated_at=to_timestamp(${user.updatedAt}) WHERE  uid = 1;`);
  });
});

