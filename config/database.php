<?php
require_once("config.php");

class Database {
    private $host     = DB-HOST;
    private $db_name  = DB_NAME;
    private $username = DB_USER;
    private $password = DB_PASS;
    public  $connection;

    public function start_connection() {
        $this->connection = null;

        try {
            // DNS
            $dns = "mysql:host=".$this->host.";dbname=".$this->db_name.";charset=utf8";

            // https://www.php.net/manual/en/pdo.construct.php
            // Instanceando o PDO para a conexão do banco de dados
            $this->connection = new PDO($dns, $this->username, $this->password);

            // Configuração de erro para lançar exceção. Sem isso o erro não pode ser tratado
            $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            // Configura o valor de retorno para ser um array associativo
            $this->connection->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

        } catch (PDOException $exception) {
            // echo "Erro de conexão: ".$exception->getMessage();
        }

        return $this->connection;
    }
}

?>