#!/bin/bash

# Inputs: 
# paired_end_1 - the path to the first paired-end read file
# paired_end_2 - the path to the second paired-end read file
# reference_genome - the path to the reference genome file
# output_bam - the prefix path for the output bam files

paired_end_1=$1
paired_end_2=$2
reference_genome=$3
output_bam=$4  # only <prefix> !!!

# Index the reference genome for use by BWA
bwa index $reference_genome

# Align the reads to the reference genome
bwa mem $reference_genome $paired_end_1 $paired_end_2 > ${output_bam}.aligned.sam

# Convert the SAM file to BAM format
samtools view -S -b ${output_bam}.aligned.sam > ${output_bam}.aligned.bam

# Sort and index the BAM file
samtools sort -o ${output_bam}.aligned.sorted.bam ${output_bam}.aligned.bam
samtools index ${output_bam}.aligned.sorted.bam

echo "Mapping is complete."