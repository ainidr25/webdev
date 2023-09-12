<?php

    //koneksi ke database dnegan PDO
    $connect = new PDO("mysql:host=localhost;dbname=latihan", "root", "");
    $received_data = json_decode(file_get_contents("php://input"));

    //script untuk menampilkan semua data
    if($received_data->action == 'fetchall')
    {
        //membuat variabel data
        //variabel ini akan digunakan untuk menampung data dari database nantinya
        $data = array();

        //perintah untuk mengambil data dari database
        $query      = "SELECT * FROM tbl_sample ORDER BY id DESC";
        $statement  = $connect->prepare($query);
        $statement->execute();

        //melakukan perulangan dan memasukan tiap data ke dalam variabel data
        while($row = $statement->fetch(PDO::FETCH_ASSOC)){
            $data[] = $row;
        }
        
        //menampilkan data dalam bentuk json
        echo json_encode($data);
    }

    if($received_data->action == 'insert')
    {
        $data = array(
            ':first_name' => $received_data->first_name,
            ':last_name' => $received_data->last_name
        );
          
        $query = "INSERT INTO tbl_sample (first_name, last_name) VALUES (:first_name, :last_name)";
        $statement  = $connect->prepare($query);
        $statement->execute($data);

    }

?>