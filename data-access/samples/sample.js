module.exports.create = `create table samples(
	sampleid integer not null,
	description varchar(30));` ;

module.exports.selectAll   = `select * from samples;` ;

module.exports.insertSome   = `
  insert into samples (sampleid, description) values (1, 'test1');
  insert into samples (sampleid, description) values (2, 'test2');
  insert into samples (sampleid, description) values (3, 'test3');
  insert into samples (sampleid, description) values (4, 'test4');
` ;
