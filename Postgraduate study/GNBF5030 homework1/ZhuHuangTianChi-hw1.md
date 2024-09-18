## GNBF5030 Homework 1

*Student id: 1155228903*

#### Question 1

1. ```Linux
   $ mkdir -p ~/5030/hw1/q1
   $ cp /hdd1/shared/ecoli/sra_metadata/SraRunTable.txt ~/5030/hw1/q1/
   ```

2. ```Linux
   $ awk '{if($3 == "SINGLE") single++; if($3 == "PAIRED") paired++} END {print "Single-end: " single "\nPaired-end: " paired}' ~/5030/hw1/q1/SraRunTable.txt
   Single-end: 35
   Paired-end: 2
   ```
   **Answer:** There are 35 Single-end samples and 2 Paired-end samples recorded in this table.
   
3. ```Linux
   $ awk 'NR > 1 && $6 > 300 {print $9}' ~/5030/hw1/q1/SraRunTable.txt | sort
   SRR098026
   SRR098028
   SRR098031
   SRR098033
   SRR098040
   SRR098041
   SRR098043
   SRR098044
   SRR098279
   SRR098280
   SRR098281
   SRR098282
   SRR098283
   SRR098284
   SRR098286
   SRR098287
   SRR098288
   ```
   **Answer:**  `SRR098026`, `SRR098028`, `SRR098031`, `SRR098033`, `SRR098040`, `SRR098041`, `SRR098043`, `SRR098044`, `SRR098279`, `SRR098280`, `SRR098281`, `SRR098282`, `SRR098283`, `SRR098284`, `SRR098286`, `SRR098287`, `SRR098288`.
   
4. ```Linux
   $ grep -v '^BioSample_s' ~/5030/hw1/q1/SraRunTable.txt | awk '{if($4 ~ /^ZDB/) print $1}' | wc -l
   30
   $ grep -v '^BioSample_s' ~/5030/hw1/q1/SraRunTable.txt | awk '$4 !~ /<no/ {print substr($4, 1, 3)}' | sort | uniq
   CZB
   REL
   ZDB
   ```
   **Answer:** There are 30 sample names start with `ZDB`.  And the other prefixes of sample names like `ZDB` are `CZB`, `REL` and `ZDB`.

#### Question 2

1. ```Linux
   $ mkdir -p ~/5030/hw1/q2
   $ ln -s /hdd1/shared/bdgp6/data/rawdata/ ~/5030/hw1/q2/
   ```
   
2. ```Linux
   $ for file in ~/5030/hw1/q2/rawdata/*.fastq; do grep -c 'NNNNNN' "$file" | awk -v file="$file" '{print $1, file}' | awk -F'/' '{print $1, $NF}'; done | sort -rn > ~/5030/hw1/q2/consecutive_ns_count.txt
   
   $ cat ~/5030/hw1/q2/consecutive_ns_count.txt
   22049  SRR072915.fastq
   20250  SRR072903.fastq
   96  SRR072893.fastq
   93  SRR072905.fastq
   ```
   **Answer:** I think the dataset `SRR072905.fastq` have better quality based on the results above, because it contains less unknown nucleotides than other datasets.

#### Question 3

1. ```Linux
   $ mkdir -p ~/5030/hw1/q3
   $ ln -s /hdd1/shared/bdgp6/data/genomes/BDGP6.Ensembl.93.gtf ~/5030/hw1/q3/BDGP6.Ensembl.93.gtf
   ```
   
2. ```Linux
   $ grep -v '^#' ~/5030/hw1/q3/BDGP6.Ensembl.93.gtf | awk '{print $3}' | sort | uniq -c
    160859 CDS
    187373 exon
     46299 five_prime_utr
     17737 gene
         4 Selenocysteine
     30492 start_codon
     33892 three_prime_utr
     34767 transcript
   ```
   **Answer:** There are 8 annotations are associated with their feature type.
   
3. ```Linux
   $ grep -v '^#' ~/5030/hw1/q3/BDGP6.Ensembl.93.gtf | grep 'transcript' | awk '{print $10}' | cut -d ';' -f 1 | sed 's/"//g' | sort | uniq -c | sort -rn | head -10
      3896 FBgn0033159
      3830 FBgn0285944
      2208 FBgn0053196
      1682 FBgn0284408
      1354 FBgn0013733
      1180 FBgn0003429
      1018 FBgn0263111
       910 FBgn0263289
       900 FBgn0086906
       854 FBgn0085447
   ```
   
4. ```Linux
   $ awk '$3 == "gene" {print $1 "\t" $4 "\t" $5 "\t" $10}' ~/5030/hw1/q3/BDGP6.Ensembl.93.gtf | cut -d ';' -f 1 | sed 's/"//g' | awk '{print $1 "\t" $2 "\t" $3 "\t" $4 "\t" ($3-$2+1)}' > ~/5030/hw1/q3/BDGP6.Ensembl.93.gene.bed
   
   $ head ~/5030/hw1/q3/BDGP6.Ensembl.93.gene.bed
   3R      567076  2532932 FBgn0267431     1965857
   3R      722370  722621  FBgn0085804     252
   3R      1031171 1031354 FBgn0039987     184
   3R      1366234 1366601 FBgn0267798     368
   3R      1865108 1866008 FBgn0267797     901
   3R      2156916 2157206 FBgn0058182     291
   3R      2554162 3263582 FBgn0267430     709421
   3R      2744304 2744800 FBgn0266747     497
   3R      3322810 3354486 FBgn0086917     31677
   3R      3461351 3587054 FBgn0010247     125704
   ```
   
5. ```Linux
   $ grep -v '^#' ~/5030/hw1/q3/BDGP6.Ensembl.93.gene.bed | awk '{if($1 !~ /^211/) print $1}' | sort | uniq -c
      3496 2L
      3621 2R
      3457 3L
      4191 3R
       111 4
        38 mitochondrion_genome
        21 rDNA
         2 Unmapped_Scaffold_8
      2671 X
       113 Y
   ```
   **Answer:** number of genes:
   
      - `2L chromosome` : 3496
      - `2R chromosome`: 3621
      - `3L chromosome`: 3457
      - `3R chromosome`: 4191
      - `4 chromosome`: 111
      - `mitochondrion_genome chromosome`: 38
      - `rDNA chromosome`: 21
      - `Unmapped_Scaffold_8 chromosome`: 2
      - `X chromosome`: 2671
      - `Y chromosome`: 113
   
6. ```Linux
   $ sort -k5,5nr ~/5030/hw1/q3/BDGP6.Ensembl.93.gene.bed | head -n 50 > ~/5030/hw1/q3/BDGP6.Ensembl.93.gene.longest50.bed && sort -k5,5nr ~/5030/hw1/q3/BDGP6.Ensembl.93.gene.bed | tail -n 50 > ~/5030/hw1/q3/BDGP6.Ensembl.93.gene.shortest50.bed
   
   $ head ~/5030/hw1/q3/BDGP6.Ensembl.93.gene.longest50.bed
   3R      567076  2532932 FBgn0267431     1965857
   3R      2554162 3263582 FBgn0267430     709421
   3L      25236940        25670980        FBgn0267429     434041
   2R      1866080 2262115 FBgn0263780     396036
   X       2740384 3134532 FBgn0028369     394149
   2R      326768  705848  FBgn0267428     379081
   X       12043698        12335214        FBgn0267001     291517
   3L      13521907        13803400        FBgn0264001     281494
   Y       1636574 1884846 FBgn0046697     248273
   X       7166451 7405797 FBgn0265457     239347
   $ head ~/5030/hw1/q3/BDGP6.Ensembl.93.gene.shortest50.bed
   3R      6451551 6451609 FBgn0283558     59
   X       9236460 9236518 FBgn0263578     59
   2R      14233130        14233187        FBgn0262427     58
   3L      8354184 8354241 FBgn0263553     58
   2R      10885533        10885589        FBgn0262412     57
   2R      13852845        13852901        FBgn0283553     57
   3R      24658605        24658660        FBgn0262431     56
   2R      18180151        18180205        FBgn0286005     55
   2R      19727098        19727152        FBgn0065076     55
   3R      8308431 8308485 FBgn0263550     55
   ```

#### Question 4

1. ```Linux
   $ tar -czf /hdd1/5030-hw/Zhu_HuangTianChi\(5030-hw1\).tar.gz -C ~/5030 hw1
   ```

2. ```Linux
   $ chmod o-rwx /hdd1/5030-hw/Zhu_HuangTianChi\(5030-hw1\).tar.gz
   ```
   
3. ```Linux
   $ du -sh ~/5030/hw1/
   680K    /hdd1/home/f24_htczhu/5030/hw1/
   $ df -h /hdd1
   Filesystem      Size  Used Avail Use% Mounted on
   /dev/sdc1        55T  3.3T   49T   7% /hdd1
   ```
