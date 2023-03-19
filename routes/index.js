import oktaVal from '../helpers/okta.js'

export default async (server, { hdbCore, logger }) => {
	server.route({
		url: '/:schema/:table',
    preValidation: (request, response, next) => oktaVal.validate(request, response, next, hdbCore, logger),
		method: 'POST',
    handler: (request) => {
      const { schema, table } = request.params;
      const { records } = request.body;

      const body = {
        operation: 'insert',
        schema,
        table,
        records,
        hdb_user: request.body.hdb_user,
      }

      return hdbCore.request({body})
    }
	});

	server.route({
		url: '/',
		method: 'GET',
		handler: () => {
			const body = {
				operation: 'sql',
				sql: 'SELECT * FROM dev.dog ORDER BY dog_name',
			};
			return hdbCore.requestWithoutAuthentication({ body });
		},
	});
};