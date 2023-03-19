import jwt from 'jsonwebtoken'

async function validate(request, response, next, hdbCore, logger) {
  const { headers } = request
  const { authorization } = headers

  if (!authorization) {
    return response.code(400).send("Unauthorized: need bearer token")
  }

  const token = authorization.split(" ")[1]
  try {
    const decoded = jwt.decode(token)
    const { scope } = decoded
    request.body.hdb_user = { role: { permission: {} } }

    const scopes = scope.split(" ")
    scopes.forEach( role => {
      const [schema, table, operation] = role.split(':')
      if (!request.body.hdb_user.role.permission[schema]) {
        request.body.hdb_user.role.permission[schema] = { tables: {} }
      }
      if (!request.body.hdb_user.role.permission[schema].tables[table]) {
        request.body.hdb_user.role.permission[schema].tables[table] = {
          read: false,
          insert: false,
          update: false,
          delete: false,
          attribute_permissions: [],
        }
      }

      request.body.hdb_user.role.permission[schema].tables[table][operation] = true
    })
  } catch (err) {
    return response.code(500).send(err)
  }
}

export default { validate };