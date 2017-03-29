package de.filiadata.datahub.business.bitbucket;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TopCommitter {

    private Long id;
    private String name;
    private String emailAddress;
    private Long numberOfCommits;

}
